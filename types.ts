export enum ProductType {
  COURSE = 'Course',
  SAAS = 'SaaS',
  EBOOK = 'E-book',
  TEMPLATE = 'Template',
  BUNDLE = 'Bundle',
  OTHER = 'Other'
}

export enum AssetPhase {
  IDENTITY = 'identity',
  PRODUCT = 'product',
  SOCIAL = 'social'
}

export type Language = 'ar' | 'en';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '3:2' | '4:3' | '3:1';

export interface CampaignInputs {
  productName: string;
  description: string;
  language: 'English' | 'Arabic';
  brandVibe?: string;
}

export interface GeneratedAsset {
  id: number;
  title: string;
  phase: AssetPhase;
  prompt: string;
  description: string;
  aspectRatio?: AspectRatio;
}

export interface PromptPlanResponse {
  assets: GeneratedAsset[];
  consistencyGuide?: string;
}

export interface ApiKeyConfig {
  key: string;
  provider: 'gemini' | 'openai';
}