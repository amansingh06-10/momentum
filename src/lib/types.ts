// ============================================================
// Momentum — Core Type Definitions
// ============================================================

export interface Topic {
  id: string;
  name: string;
  status: 'done' | 'partial' | 'pending';
  confidence: number; // 0-10
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ProgressSection {
  label: string;
  total: number;
  topics: Topic[];
}

export interface DayEntry {
  date: string;
  day: string;
  topic: string;
  rating: number | null;
  mood: number; // 1-5
  hours: number;
}

export interface WeekData {
  label: string;
  range: string;
  average: number;
  days: DayEntry[];
}

export interface ExamMark {
  subject: string;
  obtained: number;
}

export interface Exam {
  label: string;
  range: string;
  status: 'done' | 'upcoming';
  marks: ExamMark[];
}

export interface Academics {
  maxMarks: number;
  exams: Exam[];
}

export interface BackendProject {
  name: string;
  url: string;
  desc: string;
}

export interface BackendPhase {
  id: string;
  week: string;
  label: string;
  period: string;
  status: 'done' | 'partial' | 'pending';
  topics: string[];
  project: BackendProject | null;
}

export interface ScheduleDay {
  day: string;
  type: string;
  hours: string;
  commute: string;
  dsaSlot: string;
  backendSlot: string;
}

export interface AppData {
  targetGoal: number;
  targetDate: string;
  freezesAllowed: number;
  freezesUsedThisMonth: number;
  academics: Academics;
  progress: Record<string, ProgressSection>;
  weeks: WeekData[];
  backendRoadmap: BackendPhase[];
  schedule: ScheduleDay[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface AppStats {
  totalTopics: number;
  doneTopics: number;
  partialTopics: number;
  pendingTopics: number;
  avgConfidence: string;
  overallPct: number;
  targetGoal: number;
  daysLeft: number;
  hoursLeft: number;
  minsLeft: number;
  secsLeft: number;
  remainingToTarget: number;
  paceNeededPerDay: string;
  pctToTarget: number;
  streak: number;
  lastDayFrozen: boolean;
  overallAvgRating: string;
}
