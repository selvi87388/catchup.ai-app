import type { ParsedMessage } from "../types";

/**
 * Parse a raw conversation log into structured messages.
 * Supports common formats:
 *   [10:30 AM] Name: message
 *   Name: message
 *   Name (timestamp): message
 *   Name [timestamp]: message
 */
export function parseMessages(raw: string): ParsedMessage[] {
  const lines = raw.trim().split("\n");
  const messages: ParsedMessage[] = [];

  // Patterns: bracketed timestamp first, then plain Name:
  const patterns: RegExp[] = [
    /^\[(.+?)\]\s*(.+?):\s*(.*)$/,
    /^(.+?)\s*\[(.+?)\]:\s*(.*)$/,
    /^(.+?)\s*\((.+?)\):\s*(.*)$/,
  ];

  let current: ParsedMessage | null = null;

  for (const line of lines) {
    if (!line.trim()) {
      if (current) {
        messages.push(current);
        current = null;
      }
      continue;
    }

    let matched = false;
    for (const pattern of patterns) {
      const m = line.match(pattern);
      if (m) {
        if (current) messages.push(current);
        if (pattern.source.startsWith("^\\[")) {
          // [timestamp] Name: message
          current = {
            timestamp: m[1].trim(),
            sender: m[2].trim(),
            text: m[3].trim(),
            raw: line,
          };
        } else {
          current = {
            sender: m[1].trim(),
            timestamp: m[2].trim(),
            text: m[3].trim(),
            raw: line,
          };
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Try simple "Name: message" with no timestamp
      const simpleMatch = line.match(/^([A-Z][A-Za-z0-9 _.'-]+?):\s*(.*)$/);
      if (simpleMatch && !line.startsWith("http")) {
        if (current) messages.push(current);
        current = {
          sender: simpleMatch[1].trim(),
          text: simpleMatch[2].trim(),
          timestamp: null,
          raw: line,
        };
      } else if (current) {
        // Continuation of previous message
        current.text += " " + line.trim();
        current.raw += "\n" + line;
      }
    }
  }

  if (current) messages.push(current);
  return messages;
}
