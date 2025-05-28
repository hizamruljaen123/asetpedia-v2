// Chat AI Service menggunakan Together AI
export class ChatService {
  private apiUrl = 'https://api.together.xyz/v1/chat/completions';
  private apiKey = '649f05a555685ef0b0bf8b8948581c722c45a6e69c3e0c54473ea2fc930419c6';
  private model = 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free';
  private conversationHistory: Array<{ role: string; content: string }> = [];

  /**
   * Send message to AI and get response
   * @param message - User message
   * @returns AI response
   */
  async sendMessage(message: string): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      // Prepare messages for API
      const messages = [
        {
          role: 'system',
          content: `You are an expert financial market analyst and trading advisor for Asetpedia platform. You help users with:
          - Market analysis and insights
          - Trading strategies and recommendations
          - Economic news interpretation
          - Risk management advice
          - Technical and fundamental analysis
          - Portfolio optimization
          - Cryptocurrency and forex analysis
          - Market sentiment assessment
          
          Be professional, accurate, informative, and provide actionable insights. Always include risk warnings for trading advice.
          If you don't have current market data, suggest the user check the real-time widgets on the platform.`
        },
        ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
      ];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I encountered an error processing your request.';

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      return aiResponse;

    } catch (error) {
      console.error('Chat AI Error:', error);
      
      // Return appropriate error message based on error type
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return 'Sorry, I couldn\'t connect to the AI service. Please check your internet connection and try again.';
      } else if (error instanceof Error && error.message.includes('401')) {
        return 'Sorry, there\'s an authentication issue with the AI service. Please try again later.';
      } else if (error instanceof Error && error.message.includes('429')) {
        return 'Sorry, the AI service is currently busy. Please wait a moment and try again.';
      } else {
        return 'Sorry, I encountered an unexpected error. Please try again or check the real-time market widgets for current data.';
      }
    }
  }

  /**
   * Get market analysis for specific topic
   * @param topic - Market topic to analyze
   * @param context - Additional context
   * @returns Market analysis
   */
  async getMarketAnalysis(topic: string, context?: string): Promise<string> {
    const prompt = `Provide a comprehensive market analysis for: ${topic}
    ${context ? `Additional context: ${context}` : ''}
    
    Please include:
    1. Current market sentiment
    2. Key factors affecting this market
    3. Technical analysis insights
    4. Risk assessment
    5. Trading recommendations with proper risk management
    
    Format your response in a clear, professional manner.`;

    return this.sendMessage(prompt);
  }

  /**
   * Get trading recommendations
   * @param symbol - Trading symbol
   * @param timeframe - Trading timeframe
   * @returns Trading recommendations
   */
  async getTradingRecommendations(symbol: string, timeframe: string = '1D'): Promise<string> {
    const prompt = `Provide trading recommendations for ${symbol} on ${timeframe} timeframe:
    
    Please analyze:
    1. Technical indicators and chart patterns
    2. Support and resistance levels
    3. Entry and exit strategies
    4. Risk management rules
    5. Position sizing recommendations
    
    Always include proper risk warnings and disclaimer.`;

    return this.sendMessage(prompt);
  }

  /**
   * Analyze news impact on market
   * @param newsTitle - News headline
   * @param newsContent - News content
   * @returns Market impact analysis
   */
  async analyzeNewsImpact(newsTitle: string, newsContent: string): Promise<string> {
    const prompt = `Analyze the market impact of this news:
    
    Title: ${newsTitle}
    Content: ${newsContent}
    
    Please provide:
    1. Immediate market sentiment impact
    2. Affected sectors and stocks
    3. Short-term and long-term implications
    4. Trading opportunities
    5. Risk factors to consider`;

    return this.sendMessage(prompt);
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   * @returns Conversation history
   */
  getHistory(): Array<{ role: string; content: string }> {
    return [...this.conversationHistory];
  }

  /**
   * Get suggested quick responses based on context
   * @returns Array of suggested responses
   */
  getSuggestions(): string[] {
    return [
      'Analyze current market sentiment',
      'What are the best stocks to buy now?',
      'Explain cryptocurrency market trends',
      'How to manage portfolio risk?',
      'Technical analysis for SPY',
      'Impact of Federal Reserve decisions',
      'Best trading strategies for beginners',
      'How to read market indicators?',
      'Forex trading opportunities',
      'Market outlook for next week'
    ];
  }

  /**
   * Format message content for display
   * @param content - Raw message content
   * @returns Formatted HTML content
   */
  formatMessage(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-terminal-accent">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-terminal-warning">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-terminal-surface px-1 py-0.5 rounded text-terminal-accent font-mono text-sm">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-terminal-surface p-4 rounded-lg overflow-x-auto my-2 border border-terminal-border"><code class="text-terminal-accent font-mono text-sm">$1</code></pre>')
      .replace(/(\d+\.\s)/g, '<span class="text-terminal-warning font-semibold">$1</span>')
      .replace(/\n\n/g, '</p><p class="mt-2">')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/gm, '<p class="leading-relaxed">$1</p>');
  }

  /**
   * Validate message before sending
   * @param message - Message to validate
   * @returns Whether message is valid
   */
  validateMessage(message: string): boolean {
    if (!message || typeof message !== 'string') {
      return false;
    }
    
    const trimmed = message.trim();
    return trimmed.length > 0 && trimmed.length <= 4000;
  }

  /**
   * Get financial keywords for better analysis
   * @returns Array of financial keywords
   */
  getFinancialKeywords(): string[] {
    return [
      'bull market', 'bear market', 'volatility', 'support', 'resistance',
      'breakout', 'momentum', 'RSI', 'MACD', 'moving average',
      'fibonacci', 'trend line', 'volume', 'market cap', 'P/E ratio',
      'dividend yield', 'earnings', 'GDP', 'inflation', 'interest rates',
      'federal reserve', 'cryptocurrency', 'forex', 'commodities', 'derivatives'
    ];
  }
}

// Export singleton instance
export default new ChatService();
