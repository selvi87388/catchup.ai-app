import type { ParsedMessage } from "../types";

/**
 * Parse a raw conversation log into structured messages.
 *
 * Supported formats:
 *   [10:30 AM] Name: message
 *   Name: message
 *   Name (timestamp): message
 *   Name [timestamp]: message
 *
 * WhatsApp export formats:
 *   M/D/YY, H:MM AM - Name: message
 *   DD/MM/YYYY, HH:MM - Name: message
 *   [M/D/YY, H:MM AM] Name: message   (older exports)
 *
 * Handles unicode spaces (\u202f, \u00a0) used in WhatsApp exports,
 * filters system messages, and correctly handles multi-line messages.
 */

// Unicode-aware whitespace class: standard space, NBSP, NARROW NBSP, tab
const WS = `[\\s\\u00a0\\u202f]`;

// WhatsApp timestamp patterns — used to detect message boundaries
// Format: M/D/YY, H:MM AM -   or   DD/MM/YYYY, HH:MM -
const WHATSAPP_TS_PATTERN = new RegExp(
  `^(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4},${WS}+\\d{1,2}:\\d{2}(?::\\d{2})?${WS}*(?:AM|PM|am|pm)?${WS}*-${WS}*)`,
);

// Bracketed timestamp patterns: [10:30 AM] Name: message
const BRACKET_TS_PATTERN = /^\[(.+?)\]\s*(.+?):\s*(.*)$/;
// Name [timestamp]: message
const NAME_BRACKET_TS_PATTERN = /^(.+?)\s*\[(.+?)\]:\s*(.*)$/;
// Name (timestamp): message
const NAME_PAREN_TS_PATTERN = /^(.+?)\s*\((.+?)\):\s*(.*)$/;

// System messages to ignore
const SYSTEM_PATTERNS = [
  /<media omitted>/i,
  /<media omitted>/i,
  /messages and calls are end-to-end encrypted/i,
  /joined using a group link/i,
  /added .* to the group/i,
  /removed .* from the group/i,
  /changed the group (name|description)/i,
  /created group/i,
  /.* changed their phone number/i,
  /this message was deleted/i,
  /message deleted/i,
  /you were added/i,
  /tap here for contact info/i,
  /^\s*—\s*$/i,
];

function isSystemMessage(text: string): boolean {
  return SYSTEM_PATTERNS.some((p) => p.test(text));
}

/**
 * Extract sender name and message body from a WhatsApp-formatted line.
 * Input like: "10/9/26, 8:15 PM - Raj: Hey everyone!"
 * Returns { sender, text } or null if it's a system line.
 */
function parseWhatsAppLine(
  line: string,
  tsPrefix: string,
): { sender: string; text: string } | null {
  // Everything after the timestamp prefix
  const rest = line.slice(tsPrefix.length);

  // System messages have no "Name:" separator — check first
  if (isSystemMessage(rest)) return null;

  // Sender is everything up to the first ": " (WhatsApp uses ": " as separator)
  // But sender names may contain colons in rare cases, so we match up to the
  // first ": " that is followed by message content
  const colonMatch = rest.match(/^(.+?):\s*(.*)$/s);
  if (colonMatch) {
    const sender = colonMatch[1].trim();
    const text = colonMatch[2].trim();
    if (sender && text) return { sender, text };
  }

  // No colon — could be a system notification without a sender
  return null;
}

export function parseMessages(raw: string): ParsedMessage[] {
  const messages: ParsedMessage[] = [];
  let current: ParsedMessage | null = null;

  const pushCurrent = () => {
    if (current) {
      // Final filter: skip if the accumulated text is a system message
      if (!isSystemMessage(current.text)) {
        messages.push(current);
      }
      current = null;
    }
  };

  // Split on newlines but keep track of line boundaries
  const lines = raw.replace(/\r\n/g, "\n").split("\n");

  for (const line of lines) {
    // Empty line — flush current message
    if (!line.trim()) {
      pushCurrent();
      continue;
    }

    // --- Try WhatsApp timestamp pattern first ---
    const waMatch = line.match(WHATSAPP_TS_PATTERN);
    if (waMatch) {
      pushCurrent();
      const tsPrefix = waMatch[1];
      const timestamp = tsPrefix.replace(/-\s*$/, "").trim();
      const parsed = parseWhatsAppLine(line, tsPrefix);
      if (parsed) {
        current = {
          sender: parsed.sender,
          text: parsed.text,
          timestamp,
          raw: line,
        };
      }
      // If parsed is null it's a system message — skip (current stays null)
      continue;
    }

    // --- Try bracketed timestamp patterns ---
    let matched = false;

    const bracketM = line.match(BRACKET_TS_PATTERN);
    if (bracketM) {
      pushCurrent();
      const sender = bracketM[2].trim();
      const text = bracketM[3].trim();
      if (!isSystemMessage(text)) {
        current = {
          timestamp: bracketM[1].trim(),
          sender,
          text,
          raw: line,
        };
      }
      matched = true;
    }

    if (!matched) {
      const nameBracketM = line.match(NAME_BRACKET_TS_PATTERN);
      if (nameBracketM) {
        pushCurrent();
        const text = nameBracketM[3].trim();
        if (!isSystemMessage(text)) {
          current = {
            sender: nameBracketM[1].trim(),
            timestamp: nameBracketM[2].trim(),
            text,
            raw: line,
          };
        }
        matched = true;
      }
    }

    if (!matched) {
      const nameParenM = line.match(NAME_PAREN_TS_PATTERN);
      if (nameParenM) {
        pushCurrent();
        const text = nameParenM[3].trim();
        if (!isSystemMessage(text)) {
          current = {
            sender: nameParenM[1].trim(),
            timestamp: nameParenM[2].trim(),
            text,
            raw: line,
          };
        }
        matched = true;
      }
    }

    if (!matched) {
      // Try simple "Name: message" with no timestamp
      const simpleMatch = line.match(/^([A-Z][A-Za-z0-9 _.'-]+?):\s*(.*)$/);
      if (simpleMatch && !line.startsWith("http")) {
        pushCurrent();
        const text = simpleMatch[2].trim();
        if (!isSystemMessage(text)) {
          current = {
            sender: simpleMatch[1].trim(),
            text,
            timestamp: null,
            raw: line,
          };
        }
        matched = true;
      }
    }

    if (!matched) {
      // Continuation of previous message (multi-line WhatsApp messages)
      if (current) {
        current.text += " " + line.trim();
        current.raw += "\n" + line;
      }
    }
  }

  pushCurrent();
  return messages;
}
