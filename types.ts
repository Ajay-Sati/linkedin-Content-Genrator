export interface Trend {
  id: string;
  title: string;
  source: string;
  summary: string;
  businessImpact: string;
  url?: string;
}

export interface GeneratedContent {
  post: string;
  hashtags: string[];
  firstComment: string;
  imagePrompt: string;
}

export interface GeneratedImage {
  url: string;
  mimeType: string;
}

export type Tone = 'Default' | 'Technical' | 'Skeptical' | 'Beginner-Friendly';

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  TRENDS_LOADED = 'TRENDS_LOADED',
  GENERATING_POST = 'GENERATING_POST',
  POST_READY = 'POST_READY',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
}
