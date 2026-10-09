export interface ActionItem {
  id: number;
  task: string;
  assignee: string;
  deadline: string | null;
  priority: "high" | "urgent";
  context: string;
  /** AI confidence score 0..1 — null when heuristic fallback was used */
  aiScore: number | null;
}

export interface Decision {
  id: number;
  text: string;
}

export interface Summary {
  sentences: string[];
}

export interface MentionItem {
  id: number;
  person: string;
  question: string;
  sender: string;
  timestamp: string | null;
}

export interface AnalysisResult {
  actions: ActionItem[];
  decisions: Decision[];
  summary: Summary;
  mentions: MentionItem[];
  totalMessages: number;
  participants: string[];
  /** Whether on-device AI model was used for this analysis */
  aiEnabled: boolean;
}

export interface ParsedMessage {
  sender: string;
  text: string;
  timestamp: string | null;
  raw: string;
}
