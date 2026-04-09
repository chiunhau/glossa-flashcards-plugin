import { TFile } from "obsidian";

export interface PluginSettings {
  folder: string;
  geminiApiKey: string;
  geminiModel: string;
  language: string;
  customPrompt: string;
  // Output schema
  outputFields: string;
  titleField: string;
  // Note generation
  noteBodyTemplate: string;
  frontmatterConfig: string;
  // Practice
  practiceCardFront: string;
  practiceCardBack: string;
  practiceFilters: string;
  // Pro (hidden — not yet released)
  // licenseKey: string;
}

// Pro (hidden — not yet released)
// export interface ProStats {
//   cardsThisWeek: number;
//   cardsTotal: number;
//   weeklyLimit: number;
//   status: "active" | "expired" | "invalid";
// }

export interface FlashcardData {
  file: TFile;
  word: string;
  frontmatter: Record<string, string>;
}
