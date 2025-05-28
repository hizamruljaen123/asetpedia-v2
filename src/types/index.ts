export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  category: string; // Changed to string to allow for more categories
  publishedAt: string;
  aiAnalysis?: string;
  keyPoints?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  marketImpact?: 'high' | 'medium' | 'low';
}

export interface MarketData {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  timestamp: string;
}

export interface AIAnalysisResponse {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  marketImpact: 'high' | 'medium' | 'low';
  recommendations: string[];
  keywords?: string[];
  references?: string[];
  timestamp?: number;
}
