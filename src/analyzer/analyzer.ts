import type {
  ActionItem,
  AnalysisResult,
  Decision,
  MentionItem,
  ParsedMessage,
  Summary,
} from "../types";
import { parseMessages } from "./parser";

// --- Detection keywords ---

const ACTION_VERBS = [
  "need to", "needs to", "must", "should", "have to", "let's", "please",
  "can you", "could you", "will you", "make sure", "don't forget",
  "remember to", "let me know", "follow up", "send", "update", "create",
  "prepare", "review", "check", "fix", "deploy", "schedule", "call",
  "set up", "finish", "complete", "submit", "share", "confirm",
];

const DEADLINE_KEYWORDS = [
  "by tomorrow", "by monday", "by tuesday", "by wednesday", "by thursday",
  "by friday", "by the end", "by eod", "by cob", "today", "tonight",
  "asap", "urgent", "immediately", "this week", "next week", "before",
  "deadline", "due", "by ", "end of day", "end of sprint",
];

const DECISION_KEYWORDS = [
  "agreed", "decided", "let's go with", "we'll use", "final decision",
  "so we're", "that means", "conclusion", "settled on", "approved",
  "motion passed", "everyone agreed", "we are going with", "we will use",
  "we'll go with", "that's the plan", "locked in", "confirmed",
  "we've decided", "the decision is",
];

const QUESTION_PATTERN = /\?|^(what|how|when|where|why|who|can|could|should|would|do you|did you|are you|will you|is it|has anyone)\b/i;

const URGENT_INDICATORS = [
  "urgent", "asap", "immediately", "critical", "emergency", "blocking",
  "blocker", "hotfix", "right now", "important", "priority",
  "production down", "outage", "broken", "down",
];

// --- Helpers ---

function isQuestion(text: string): boolean {
  return QUESTION_PATTERN.test(text);
}

function extractDeadline(text: string): string | null {
  const lower = text.toLowerCase();
  for (const kw of DEADLINE_KEYWORDS) {
    const idx = lower.indexOf(kw);
    if (idx !== -1) {
      const start = idx;
      const end = Math.min(start + 40, text.length);
      return text.slice(start, end).trim().replace(/[,.]$/, "");
    }
  }
  // Date patterns like Oct 15, 10/15, 2024-10-15, Oct 15th
  const dateMatch = text.match(/\b(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?)\b/i);
  if (dateMatch) return dateMatch[1];
  return null;
}

function detectPriority(text: string, deadline: string | null): "high" | "urgent" {
  const lower = text.toLowerCase();
  if (URGENT_INDICATORS.some((kw) => lower.includes(kw))) return "urgent";
  if (deadline) {
    const dlLower = deadline.toLowerCase();
    if (URGENT_INDICATORS.some((kw) => dlLower.includes(kw))) return "urgent";
    if (["today", "tonight", "asap", "tomorrow", "eod", "cob", "now"].some((kw) => dlLower.includes(kw))) {
      return "urgent";
    }
  }
  return "high";
}

function extractAssignee(text: string, allSenders: string[]): string | null {
  // @mentions
  const mentionMatch = text.match(/@([A-Za-z][A-Za-z0-9._-]+)/);
  if (mentionMatch) {
    const name = mentionMatch[1];
    const match = allSenders.find((s) => s.toLowerCase().includes(name.toLowerCase()));
    return match || name;
  }
  // "Name, can you..." / "Name, please..."
  for (const sender of allSenders) {
    const firstName = sender.split(/\s+/)[0];
    if (firstName && firstName.length > 2) {
      // Check if the sender name is mentioned in someone else's message
      const patterns = [
        new RegExp(`\\b${firstName}\\b[,\\s]+(?:can you|could you|please|need you|you should|make sure|don't forget)`, "i"),
        new RegExp(`(?:can you|could you|please|need you to|you should)\\b[^.]*\\b${firstName}\\b`, "i"),
      ];
      for (const p of patterns) {
        if (p.test(text)) return sender;
      }
    }
  }
  // "I'll do it" / "I will" / "I need to" — sender is the assignee
  if (/\b(?:i'?ll|i will|i'm going to|i need to|i should|i have to)\b/i.test(text)) {
    return null; // Will be set to sender by caller
  }
  return null;
}

function isActionItem(text: string): boolean {
  const lower = text.toLowerCase();
  // Must be a statement (not a pure question) containing action indicators
  if (isQuestion(text) && !ACTION_VERBS.some((v) => lower.includes(v))) return false;
  return ACTION_VERBS.some((v) => lower.includes(v));
}

function isDecision(text: string): boolean {
  const lower = text.toLowerCase();
  return DECISION_KEYWORDS.some((kw) => lower.includes(kw));
}

function cleanTaskText(text: string): string {
  // Remove sender prefix if somehow present
  let cleaned = text.replace(/^[^:]+:\s*/, "");
  // Remove timestamps
  cleaned = cleaned.replace(/^\[.+?\]\s*/, "");
  // Capitalize first letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  // Truncate if very long
  if (cleaned.length > 200) {
    cleaned = cleaned.slice(0, 197) + "...";
  }
  return cleaned;
}

// --- Main analysis function ---

export function analyzeConversation(raw: string): AnalysisResult {
  const messages = parseMessages(raw);
  const allSenders = [...new Set(messages.map((m) => m.sender))];

  const actions: ActionItem[] = [];
  const decisions: Decision[] = [];
  const mentions: MentionItem[] = [];
  let actionId = 0;
  let decisionId = 0;
  let mentionId = 0;

  const seenActionTexts = new Set<string>();
  const seenDecisionTexts = new Set<string>();

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    // --- Action items ---
    if (isActionItem(msg.text)) {
      const taskText = cleanTaskText(msg.text);
      if (!seenActionTexts.has(taskText.toLowerCase())) {
        seenActionTexts.add(taskText.toLowerCase());
        const deadline = extractDeadline(msg.text);
        const priority = detectPriority(msg.text, deadline);
        let assignee = extractAssignee(msg.text, allSenders);
        if (!assignee) {
          // If message contains "I'll/I need to", sender is assignee
          if (/\b(?:i'?ll|i will|i'm going to|i need to|i should|i have to)\b/i.test(msg.text)) {
            assignee = msg.sender;
          } else {
            assignee = "Unassigned";
          }
        }

        actions.push({
          id: actionId++,
          task: taskText,
          assignee,
          deadline,
          priority,
          context: msg.sender,
        });
      }
    }

    // --- Decisions ---
    if (isDecision(msg.text)) {
      const decisionText = cleanTaskText(msg.text);
      if (!seenDecisionTexts.has(decisionText.toLowerCase())) {
        seenDecisionTexts.add(decisionText.toLowerCase());
        decisions.push({
          id: decisionId++,
          text: decisionText,
        });
      }
    }

    // --- Mentions & unanswered questions ---
    if (isQuestion(msg.text)) {
      // Check if any subsequent message answers it
      let answered = false;
      // Look for replies within next 10 messages
      const mentionedPerson = extractAssignee(msg.text, allSenders);

      for (let j = i + 1; j < Math.min(i + 15, messages.length); j++) {
        const reply = messages[j];
        // Answered if the mentioned person replies with a non-question,
        // or if anyone replies with a direct answer (not another question)
        if (mentionedPerson && reply.sender === mentionedPerson && !isQuestion(reply.text)) {
          answered = true;
          break;
        }
        // Also check if someone directly answers with "yes", "no", or a specific reply
        if (!isQuestion(reply.text) && reply.text.length > 5) {
          const replyLower = reply.text.toLowerCase();
          if (replyLower.match(/^(yes|no|yep|nope|done|sure|ok|okay|confirmed|that's right|exactly)\b/i)) {
            answered = true;
            break;
          }
        }
      }

      if (!answered) {
        mentions.push({
          id: mentionId++,
          person: mentionedPerson || "Everyone",
          question: cleanTaskText(msg.text),
          sender: msg.sender,
          timestamp: msg.timestamp,
        });
      }
    }
  }

  // --- TL;DR Summary ---
  const summary = generateSummary(messages, actions, decisions, mentions);

  return {
    actions,
    decisions,
    summary,
    mentions,
    totalMessages: messages.length,
    participants: allSenders,
  };
}

function generateSummary(
  messages: ParsedMessage[],
  actions: ActionItem[],
  decisions: Decision[],
  mentions: MentionItem[],
): Summary {
  const participantCount = new Set(messages.map((m) => m.sender)).size;

  // Collect key topics by frequency of significant words
  const wordFreq = new Map<string, number>();
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "can", "to", "of", "in", "on", "at",
    "by", "for", "with", "about", "as", "into", "like", "through", "after",
    "over", "between", "out", "against", "during", "without", "before",
    "under", "around", "among", "and", "but", "or", "nor", "so", "yet",
    "both", "either", "neither", "each", "every", "all", "any", "few",
    "more", "most", "other", "some", "such", "no", "not", "only", "own",
    "same", "than", "too", "very", "just", "this", "that", "these", "those",
    "i", "you", "he", "she", "it", "we", "they", "what", "which", "who",
    "when", "where", "why", "how", "all", "each", "get", "got", "your",
    "our", "their", "his", "her", "its", "my", "me", "him", "them", "if",
    "then", "else", "from", "up", "down", "out", "off", "above", "below",
    "there", "here", "now", "also", "well", "even", "still", "back",
  ]);

  for (const msg of messages) {
    const words = msg.text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    for (const word of words) {
      if (!stopWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    }
  }

  const topTopics = [...wordFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  // Build 3 sentences
  const sentences: string[] = [];

  // Sentence 1: Overview of conversation
  const mainTopic = topTopics.slice(0, 3).join(", ");
  if (mainTopic) {
    sentences.push(
      `This conversation involved ${participantCount} participants discussing ${mainTopic} across ${messages.length} messages.`,
    );
  } else {
    sentences.push(
      `This conversation involved ${participantCount} participants exchanging ${messages.length} messages.`,
    );
  }

  // Sentence 2: Key actions/deadlines
  if (actions.length > 0) {
    const urgentActions = actions.filter((a) => a.priority === "urgent");
    if (urgentActions.length > 0) {
      sentences.push(
        `${actions.length} action items were identified, ${urgentActions.length} of which are marked urgent with approaching deadlines.`,
      );
    } else {
      sentences.push(
        `${actions.length} action items were identified with varying priorities and deadlines.`,
      );
    }
  } else {
    sentences.push(
      "No explicit action items were identified in this conversation.",
    );
  }

  // Sentence 3: Decisions/outcome
  if (decisions.length > 0) {
    sentences.push(
      `The group reached ${decisions.length} key decision${decisions.length > 1 ? "s" : ""}, and several questions remain unanswered.`,
    );
  } else {
    sentences.push(
      `No formal decisions were recorded, and ${mentions.length > 0 ? `${mentions.length} unanswered question${mentions.length > 1 ? "s" : ""} remain${mentions.length === 1 ? "s" : ""}` : "all questions were addressed"}.`,
    );
  }

  return { sentences };
}
