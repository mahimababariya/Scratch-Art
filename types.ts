export interface SketchResult {
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  EDITING = 'EDITING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface GeneratedImagePart {
  inlineData?: {
    data: string;
    mimeType: string;
  };
  text?: string;
}

export interface GenerationConfig {
  aspectRatio: "1:1" | "3:4" | "4:3" | "16:9" | "9:16";
}