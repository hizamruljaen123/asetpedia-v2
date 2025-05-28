import type { AIAnalysisResponse } from '../types';

export class AIAnalysisService {
  private apiUrl = 'https://api.together.xyz/v1/chat/completions';
  private apiKey = '649f05a555685ef0b0bf8b8948581c722c45a6e69c3e0c54473ea2fc930419c6';
  private model = 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free';
  
  // Auto-analysis settings
  private autoAnalysisInterval: NodeJS.Timeout | null = null;
  private lastAnalysisTime: Date = new Date();
  private analysisCache: Map<string, AIAnalysisResponse> = new Map();
  private readonly ANALYSIS_INTERVAL = 15 * 60 * 1000; // 15 minutes
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  /**
   * Auto-analyze news content with keywords and references
   * @param newsContent - Raw news content to analyze
   * @param category - News category for context
   * @returns AI analysis response with keywords and references
   */
  async analyzeNews(newsContent: string, category: string): Promise<AIAnalysisResponse> {    // Check cache first
    const cacheKey = `${category}_${newsContent.substring(0, 100)}`;
    const cached = this.analysisCache.get(cacheKey);
    if (cached && cached.timestamp && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached;
    }

    try {
      const prompt = `Analyze the following ${category} news article and provide:
1. A concise summary (2-3 sentences)
2. Key points (3-5 bullet points)
3. Sentiment analysis (positive/negative/neutral)
4. Market impact assessment (high/medium/low)
5. Investment recommendations or insights
6. Important keywords and tags (5-8 keywords)
7. Reference sources or related topics for further research

News Content:
${newsContent}

Please respond in JSON format with the following structure:
{
  "summary": "...",
  "keyPoints": ["...", "...", "..."],
  "sentiment": "positive|negative|neutral",
  "marketImpact": "high|medium|low",
  "recommendations": ["...", "...", "..."],
  "keywords": ["keyword1", "keyword2", "..."],
  "references": ["source1", "topic2", "..."],
  "timestamp": ${Date.now()}
}`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are Asetpedia AI - an expert financial analyst specializing in automated market news analysis. 
              Provide accurate, concise, and actionable insights for traders and investors.
              Always respond with valid JSON format. Include relevant keywords and reference sources for further research.
              Focus on providing automated, comprehensive analysis without chat interaction.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.3,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || '';

      // Parse JSON response
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          analysis.timestamp = Date.now();
          
          // Cache the result
          this.analysisCache.set(cacheKey, analysis);
          return analysis;
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON, using fallback');
      }

      // Enhanced fallback response with keywords and references
      const fallbackAnalysis = {
        summary: aiResponse.substring(0, 200) + '...',
        keyPoints: ['Analysis available', 'Market data reviewed', 'Impact assessed'],
        sentiment: 'neutral' as const,
        marketImpact: 'medium' as const,
        recommendations: ['Monitor for further developments', 'Review market conditions'],
        keywords: this.extractKeywords(newsContent),
        references: ['Market News', 'Financial Analysis', 'Economic Indicators'],
        timestamp: Date.now()
      };
      
      this.analysisCache.set(cacheKey, fallbackAnalysis);
      return fallbackAnalysis;

    } catch (error) {
      console.error('AI Analysis Error:', error);
      const errorAnalysis = {
        summary: 'Analysis temporarily unavailable',
        keyPoints: ['Error in analysis', 'Manual review needed'],
        sentiment: 'neutral' as const,
        marketImpact: 'medium' as const,
        recommendations: ['Manual review recommended', 'Check system status'],
        keywords: this.extractKeywords(newsContent),
        references: ['System Status', 'Technical Support'],
        timestamp: Date.now()
      };
      
      return errorAnalysis;
    }
  }
  /**
   * Auto-generate comprehensive market summary with keywords
   * @param articles - Array of news articles
   * @param language - The language for the summary (e.g., 'English', 'Indonesian')
   * @returns Comprehensive market summary with analysis
   */
  async summarizeMarketNews(articles: Array<{ title: string; content: string; category: string }>, language: string = 'English'): Promise<string> {
    try {
      const newsDigest = articles.map(article => 
        `[${article.category.toUpperCase()}] ${article.title}: ${article.content.substring(0, 300)}...`
      ).join('\\n\\n');

      const prompt = `Based on the following news articles, provide a comprehensive automated market summary that includes:
1. Overall market sentiment and momentum
2. Key themes and emerging trends
3. Potential market implications and risks
4. Trading opportunities and strategic insights
5. Important keywords for tracking
6. Reference topics for further analysis

News Digest:
${newsDigest}

Provide a professional automated analysis in 300-400 words in ${language} with clear actionable insights.`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are Asetpedia AI - an automated market analysis system providing comprehensive daily market summaries for professional traders and investors. Focus on automated insights without chat interaction.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.4,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content || 'Market summary unavailable';
      
      // Update last analysis time
      this.lastAnalysisTime = new Date();
      
      return summary;

    } catch (error) {
      console.error('Market Summary Error:', error);
      return 'Automated market summary temporarily unavailable. Individual news analysis remains active for detailed insights.';
    }
  }
  /**
   * Get automated AI-powered trading recommendations with keywords
   * @param marketData - Current market conditions
   * @param newsContext - Recent news context
   * @returns Trading recommendations with keywords and references
   */
  async getTradingRecommendations(
    marketData: string, 
    newsContext: string
  ): Promise<{ recommendations: string[]; keywords: string[]; references: string[] }> {
    try {
      const prompt = `Based on current market conditions and recent news, provide automated trading analysis including:
1. 3-5 specific trading recommendations with clear strategies
2. Key risk management points
3. Important keywords to monitor
4. Reference topics for further research
5. Market timing considerations

Market Data:
${marketData}

News Context:
${newsContext}

Provide actionable automated recommendations with proper risk management, keywords, and references.`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are Asetpedia AI - an automated trading analysis system. Provide specific, actionable recommendations with proper risk management, relevant keywords, and reference topics for further research.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1200,
          temperature: 0.3,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fullResponse = data.choices?.[0]?.message?.content || '';
      
      // Split into recommendations and extract keywords/references
      const recommendations = fullResponse
        .split(/\d+\.|[\n\r]+/)
        .filter((rec: string) => rec.trim().length > 20)
        .map((rec: string) => rec.trim())
        .slice(0, 5);

      const keywords = this.extractKeywords(fullResponse);
      const references = this.extractReferences(fullResponse);

      return {
        recommendations,
        keywords,
        references
      };

    } catch (error) {
      console.error('Trading Recommendations Error:', error);
      return {
        recommendations: ['Automated trading recommendations temporarily unavailable'],
        keywords: ['System Status', 'Trading Analysis', 'Market Data'],
        references: ['Technical Analysis', 'Market Conditions', 'Risk Management']
      };
    }
  }

  /**
   * Extract keywords from text content
   * @param content - Text content to analyze
   * @returns Array of relevant keywords
   */
  private extractKeywords(content: string): string[] {
    const commonKeywords = [
      'market', 'trading', 'investment', 'stock', 'price', 'volume', 'trend',
      'analysis', 'sentiment', 'bullish', 'bearish', 'volatility', 'risk',
      'profit', 'loss', 'support', 'resistance', 'breakout', 'momentum'
    ];

    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const keywords = words
      .filter(word => commonKeywords.includes(word))
      .slice(0, 8);

    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Extract reference topics from content
   * @param content - Text content to analyze
   * @returns Array of reference topics
   */
  private extractReferences(content: string): string[] {
    const commonReferences = [
      'Technical Analysis', 'Fundamental Analysis', 'Market Research',
      'Economic Indicators', 'Financial News', 'Trading Strategies',
      'Risk Management', 'Portfolio Management', 'Market Trends'
    ];

    // Simple keyword-based reference extraction
    const references = commonReferences.filter(ref => 
      content.toLowerCase().includes(ref.toLowerCase().split(' ')[0])
    );

    return references.slice(0, 5);
  }

  /**
   * Start automated analysis service
   */
  startAutoAnalysis(): void {
    if (this.autoAnalysisInterval) {
      clearInterval(this.autoAnalysisInterval);
    }

    this.autoAnalysisInterval = setInterval(() => {
      console.log('Running automated market analysis...');
      this.lastAnalysisTime = new Date();
    }, this.ANALYSIS_INTERVAL);

    console.log('Automated analysis service started');
  }

  /**
   * Stop automated analysis service
   */
  stopAutoAnalysis(): void {
    if (this.autoAnalysisInterval) {
      clearInterval(this.autoAnalysisInterval);
      this.autoAnalysisInterval = null;
    }
    console.log('Automated analysis service stopped');
  }

  /**
   * Get analysis cache statistics
   */
  getCacheStats(): { size: number; lastAnalysis: Date } {
    return {
      size: this.analysisCache.size,
      lastAnalysis: this.lastAnalysisTime
    };
  }
  /**
   * Clear analysis cache
   */
  clearCache(): void {
    this.analysisCache.clear();
    console.log('Analysis cache cleared');
  }
}

export default new AIAnalysisService();
