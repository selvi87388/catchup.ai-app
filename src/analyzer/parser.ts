import type { ParsedMessage } from "../types";

/**
 * Parse a raw conversation log into structured messages.
 *
 * Supported formats:
 *   Slack:     [10:30 AM] Name: message
 *   WhatsApp:  M/D/YY, H:MM AM - Name: message  (\u202f or normal spaces)
 *   Simple:    Name: message
 *
 * Filters WhatsApp system messages and falls back to treating every
 * non-empty line as a message if no structured format is detected.
 */

// Unicode-aware whitespace: standard space, NBSP, NARROW NBSP, tab, etc.
const WS = `[\\s\\u00a0\\u202f]`;

/**
 * Main message-splitting regex.
 * Captures: (1) timestamp prefix, (2) sender name, (3) message body.
 * Handles Slack bracketed times and WhatsApp date/time formats.
 * Multi-line messages are captured via [\s\S]*? with a lookahead
 * for the next message boundary or end-of-string.
 */
const MESSAGE_REGEX = new RegExp(
  `(?:^|\\n)` +
    `(` + // Group 1 — timestamp prefix
      `\\[\\d{1,2}:\\d{2}(?::\\d{2})?${WS}*(?:AM|PM|am|pm)?\\]` + // Slack: [10:30 AM]
      `|` +
      `\\d{1,2}\\/\\d{1,2}\\/\\d{2,4},${WS}*\\d{1,2}:\\d{2}(?::\\d{2})?${WS}*(?:AM|PM|am|pm)?${WS}*-${WS}*` + // WhatsApp: M/D/YY, H:MM AM -
    `)` +
    `([^:\\n]+)` + // Group 2 — sender name (no colons/newlines)
    `:\\s*` + // colon separator
    `([\\s\\S]*?)` + // Group 3 — message body (lazy, multi-line)
    `(?=(?:\\n(?:\\[\\d{1,2}:\\d{2}|(?:\\d{1,2}\\/\\d{1,2}\\/\\d{2,4},)))|$)`, // lookahead: next message or EOF
  "gi",
);

// System messages to filter out (case-insensitive)
const SYSTEM_PATTERNS = [
  /<media omitted>/i,
  /<media omitted>/i,
  /messages and calls are end-to-end encrypted/i,
  /this message was deleted/i,
  /message deleted/i,
  /joined using a group link/i,
  /added .* to the group/i,
  /removed .* from the group/i,
  /changed the group (name|description)/i,
  /created group/i,
  /.* changed their phone number/i,
  /you were added/i,
  /tap here for contact info/i,
  /^\s*—\s*$/i,
];

function isSystemMessage(text: string): boolean {
  return SYSTEM_PATTERNS.some((p) => p.test(text));
}

/** Extract a clean timestamp string from a matched prefix. */
function extractTimestamp(prefix: string): string | null {
  // Slack: [10:30 AM]
  const slackMatch = prefix.match(/^\[(.+?)\]$/);
  if (slackMatch) return slackMatch[1].trim();
  // WhatsApp: M/D/YY, H:MM AM - (strip trailing dash and whitespace)
  const waMatch = prefix.match(
    /^(\d{1,2}\/\d{1,2}\/\d{2,4},.*?\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\s*-\s*$/,
  );
  if (waMatch) return waMatch[1].trim();
  return null;
}

export function parseMessages(raw: string): ParsedMessage[] {
  const normalized = raw.replace(/\r\n/g, "\n");
  const messages: ParsedMessage[] = [];

  // --- Phase 1: Regex extraction for timestamped formats (Slack + WhatsApp) ---
  MESSAGE_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = MESSAGE_REGEX.exec(normalized)) !== null) {
    const prefix = match[1];
    const sender = match[2].trim();
    const text = match[3].trim();
    const timestamp = extractTimestamp(prefix);

    if (sender && text && !isSystemMessage(text)) {
      messages.push({
        sender,
        text,
        timestamp,
        raw: match[0].replace(/^\n/, "").trim(),
      });
    }
  }

  if (messages.length > 0) return messages;

  // --- Phase 2: Simple "Name: message" format (no timestamps) ---
  const lines = normalized.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const simpleMatch = trimmed.match(/^([A-Z][A-Za-z0-9 _.'-]+?):\s*(.*)$/);
    if (simpleMatch && !trimmed.startsWith("http")) {
      const sender = simpleMatch[1].trim();
      const text = simpleMatch[2].trim();
      if (text && !isSystemMessage(text)) {
        messages.push({
          sender,
          text,
          timestamp: null,
          raw: trimmed,
        });
      }
    }
  }

  if (messages.length > 0) return messages;

  // --- Phase 3: Fallback — treat every non-empty line as a conversation item ---
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || isSystemMessage(trimmed)) continue;
    messages.push({
      sender: "Unknown",
      text: trimmed,
      timestamp: null,
      raw: trimmed,
    });
  }

  return messages;
}
