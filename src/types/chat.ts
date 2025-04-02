
export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export type ADHDProfile = {
  timePerception: number; // 0-100%, accuracy in estimating time
  taskInitiation: number; // 0-100%, difficulty in starting tasks
  sustainedAttention: number; // 0-100%, ability to maintain focus
  workingMemory: number; // 0-100%, capacity for working memory
  emotionalRegulation: number; // 0-100%, ability to regulate emotions
  optimalWorkPeriods: string[]; // Best times of day for productivity
  commonDistractions: string[]; // Frequent distractions
};
