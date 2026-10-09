export interface ActionItem {
  id: number;
  task: string;
  assignee: string;
  deadline: string | null;
  priority: "high" | "urgent";
  context: string;
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
}

export interface ParsedMessage {
  sender: string;
  text: string;
  timestamp: string | null;
  raw: string;
}
