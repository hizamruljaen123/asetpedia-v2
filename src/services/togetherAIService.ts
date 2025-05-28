interface TogetherAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface NewsAnalysisRequest {
  articles: Array<{
    title: string;
    content: string;
    category: string;
    publishedAt: string;
  }>;
  topic: string;
}

class TogetherAIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.together.xyz/v1';

  constructor() {
    // In production, this should be loaded from environment variables
    this.apiKey = import.meta.env.VITE_TOGETHER_AI_API_KEY || null;
  }

  async summarizeNewsByTopic(articles: NewsAnalysisRequest['articles'], topic: string): Promise<string> {
    if (!this.apiKey) {
      console.warn('Together AI API key not configured, using mock summarization');
      return this.mockSummarization(topic, articles);
    }

    try {
      const prompt = this.buildSummarizationPrompt(articles, topic);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-2-7b-chat-hf',
          messages: [
            {
              role: 'system',
              content: 'You are a professional financial news analyst. Provide concise, objective summaries of news topics focusing on market implications and key trends. Keep summaries to 2-3 sentences.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.3,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`Together AI API error: ${response.status}`);
      }

      const data: TogetherAIResponse = await response.json();
      return data.choices[0]?.message?.content || this.mockSummarization(topic, articles);
      
    } catch (error) {
      console.error('Error calling Together AI:', error);
      return this.mockSummarization(topic, articles);
    }
  }

  private buildSummarizationPrompt(articles: NewsAnalysisRequest['articles'], topic: string): string {
    const articleSummaries = articles.slice(0, 5).map((article, index) => 
      `${index + 1}. ${article.title} - ${article.content.substring(0, 200)}...`
    ).join('\n');

    return `Analyze these ${topic} news articles and provide a professional market summary:

${articleSummaries}

Please provide a concise 2-3 sentence summary focusing on:
- Key market trends and implications
- Overall sentiment and direction
- Important factors driving the topic

Summary:`;
  }

  async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
    if (!this.apiKey) {
      return this.mockSentimentAnalysis(text);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-2-7b-chat-hf',
          messages: [
            {
              role: 'system',
              content: 'You are a sentiment analysis expert. Analyze the sentiment of financial news and respond with only: positive, negative, or neutral.'
            },
            {
              role: 'user',
              content: `Analyze the sentiment of this financial news text: "${text.substring(0, 500)}"`
            }
          ],
          max_tokens: 10,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Together AI API error: ${response.status}`);
      }

      const data: TogetherAIResponse = await response.json();
      const sentiment = data.choices[0]?.message?.content?.toLowerCase().trim();
      
      if (sentiment?.includes('positive')) return 'positive';
      if (sentiment?.includes('negative')) return 'negative';
      return 'neutral';
      
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return this.mockSentimentAnalysis(text);
    }
  }

  async generateMarketInsights(articles: NewsAnalysisRequest['articles']): Promise<string[]> {
    if (!this.apiKey) {
      return this.mockMarketInsights();
    }

    try {
      const prompt = `Based on these financial news articles, provide 3-5 key market insights:

${articles.slice(0, 10).map((article, index) => 
  `${index + 1}. ${article.title}`
).join('\n')}

Provide actionable insights for investors and traders:`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-2-7b-chat-hf',
          messages: [
            {
              role: 'system',
              content: 'You are a professional market analyst. Provide clear, actionable insights in bullet points.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.4
        })
      });

      if (!response.ok) {
        throw new Error(`Together AI API error: ${response.status}`);
      }

      const data: TogetherAIResponse = await response.json();
      const insights = data.choices[0]?.message?.content || '';
      
      return insights.split('\n').filter(line => line.trim()).slice(0, 5);
      
    } catch (error) {
      console.error('Error generating market insights:', error);
      return this.mockMarketInsights();
    }
  }

  private mockSummarization(topic: string, articles: NewsAnalysisRequest['articles']): string {
    const templates = {
      business: "Corporate earnings reports show mixed results with technology companies outperforming traditional sectors. Market volatility reflects uncertainty about economic growth prospects while investor sentiment remains cautiously optimistic.",
      economy: "Economic indicators present a complex picture with employment data showing strength while inflation concerns persist. Central bank policy decisions continue to influence market expectations and investment flows.",
      technology: "Technology sector demonstrates resilience with continued innovation in AI and cybersecurity driving investment interest. Digital transformation initiatives across industries create new opportunities while regulatory scrutiny increases.",
      politics: "Political developments impact market sentiment through policy announcements affecting trade, taxation, and regulatory frameworks. International relations influence commodity prices and currency valuations across global markets.",
      world: "Global market movements reflect interconnected economic relationships with regional developments affecting international trade flows. Cross-border investment patterns indicate strategic positioning for emerging market opportunities.",
      markets: "Financial markets exhibit volatility amid changing economic conditions with institutional investors adjusting portfolio allocations. Trading volumes suggest active repositioning as market participants respond to evolving macro trends."
    };

    return templates[topic as keyof typeof templates] || 
           `Analysis of ${articles.length} recent ${topic} articles reveals significant market developments with implications for investment strategies and business operations.`;
  }

  private mockSentimentAnalysis(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['growth', 'increase', 'positive', 'gain', 'rise', 'success', 'improvement', 'strong', 'bullish'];
    const negativeWords = ['decline', 'fall', 'negative', 'loss', 'drop', 'concern', 'crisis', 'weak', 'bearish'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private mockMarketInsights(): string[] {
    return [
      "Technology sector continues to show strong fundamentals with AI adoption driving growth",
      "Central bank policy uncertainty creates opportunities in fixed income markets",
      "Commodity prices reflect global supply chain adjustments and demand patterns",
      "ESG investing trends influence capital allocation across multiple sectors",
      "Currency volatility presents both risks and opportunities for international exposure"
    ];
  }

  // Health check for the API
  async checkApiHealth(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-2-7b-chat-hf',
          messages: [
            {
              role: 'user',
              content: 'Test'
            }
          ],
          max_tokens: 1
        })
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

export default new TogetherAIService();
