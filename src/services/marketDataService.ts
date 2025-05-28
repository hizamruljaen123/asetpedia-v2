import type { MarketData } from '../types';
import freeWidgetService from './freeWidgetService';

export class MarketDataService {
  private cache = new Map<string, MarketData>();
  private lastFetch = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for free data
  // Popular market symbols - expanded list
  private symbols = [
    // Major ETFs
    'SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VEA', 'VWO',
    
    // Technology
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'ADBE', 'CRM',
    
    // Financial
    'JPM', 'BAC', 'WFC', 'GS', 'C', 'V', 'MA', 'AXP',
    
    // Healthcare
    'JNJ', 'PFE', 'UNH', 'ABBV', 'MRK', 'TMO', 'ABT',
    
    // Energy
    'XOM', 'CVX', 'COP', 'SLB', 'EOG', 'KMI',
    
    // Consumer
    'KO', 'PEP', 'WMT', 'HD', 'MCD', 'NKE', 'SBUX',
    
    // Industrial
    'BA', 'CAT', 'GE', 'UPS', 'HON', 'LMT',
    
    // Crypto
    'BTC-USD', 'ETH-USD', 'ADA-USD', 'BNB-USD', 'XRP-USD', 'SOL-USD'
  ];

  /**
   * Fetch market data for symbols
   * @param symbols - Array of symbols to fetch
   * @param forceRefresh - Force refresh cache
   * @returns Array of market data
   */
  async fetchMarketData(symbols?: string[], forceRefresh = false): Promise<MarketData[]> {
    const symbolsToFetch = symbols || this.symbols;
    const now = Date.now();
    const results: MarketData[] = [];

    for (const symbol of symbolsToFetch) {
      const lastFetchTime = this.lastFetch.get(symbol) || 0;
      
      // Check cache validity
      if (!forceRefresh && this.cache.has(symbol) && (now - lastFetchTime) < this.CACHE_DURATION) {
        const cachedData = this.cache.get(symbol);
        if (cachedData) {
          results.push(cachedData);
          continue;
        }
      }

      try {
        const data = await this.fetchSymbolData(symbol);
        if (data) {
          this.cache.set(symbol, data);
          this.lastFetch.set(symbol, now);
          results.push(data);
        }
      } catch (error) {
        console.warn(`Failed to fetch data for ${symbol}:`, error);
        
        // Return cached data if available
        const cachedData = this.cache.get(symbol);
        if (cachedData) {
          results.push(cachedData);
        }
      }
    }

    return results;
  }
  /**
   * Fetch data for a single symbol using free widget service
   * @param symbol - Symbol to fetch
   * @returns Market data or null
   */
  private async fetchSymbolData(symbol: string): Promise<MarketData | null> {
    try {
      // First try free widget service
      if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('ADA')) {
        // Use crypto service for crypto symbols
        const cryptoSymbol = symbol.replace('-USD', '').toLowerCase();
        const cryptoData = await freeWidgetService.getFreeCryptoData([cryptoSymbol]);
        if (cryptoData && cryptoData.length > 0) {
          return cryptoData[0];
        }
      } else {
        // Use free market data service for stocks
        const marketData = await freeWidgetService.getFreeMarketData(symbol);
        if (marketData) {
          return marketData;
        }
      }

      // Fallback to Yahoo Finance API
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const result = data?.chart?.result?.[0];
      
      if (!result) {
        return this.generateMockData(symbol);
      }

      const meta = result.meta;
      const currentPrice = meta.regularMarketPrice || meta.previousClose;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      return {
        symbol,
        price: parseFloat(currentPrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: meta.regularMarketVolume || 0,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.warn(`API call failed for ${symbol}, using mock data:`, error);
      return this.generateMockData(symbol);
    }
  }

  /**
   * Generate realistic mock market data
   * @param symbol - Symbol to generate data for
   * @returns Mock market data
   */
  private generateMockData(symbol: string): MarketData {
    // Base prices for different types of assets
    const basePrices: Record<string, number> = {
      'SPY': 450,
      'QQQ': 380,
      'AAPL': 175,
      'MSFT': 340,
      'GOOGL': 140,
      'AMZN': 150,
      'TSLA': 200,
      'META': 320,
      'NVDA': 800,
      'BTC-USD': 45000,
      'ETH-USD': 2800,
    };

    const basePrice = basePrices[symbol] || 100;
    
    // Generate realistic price movement
    const randomFactor = (Math.random() - 0.5) * 0.1; // ±5% max change
    const currentPrice = basePrice * (1 + randomFactor);
    const change = currentPrice - basePrice;
    const changePercent = (change / basePrice) * 100;
    
    // Generate realistic volume
    const baseVolume = symbol.includes('USD') ? Math.random() * 1000000 : Math.random() * 10000000;

    return {
      symbol,
      price: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(baseVolume),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get historical data for charting
   * @param symbol - Symbol to get history for
   * @param period - Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
   * @returns Array of historical data points
   */
  async getHistoricalData(
    symbol: string, 
    period = '1mo'
  ): Promise<Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }>> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const periodMap: Record<string, number> = {
        '1d': 86400,
        '5d': 432000,
        '1mo': 2592000,
        '3mo': 7776000,
        '6mo': 15552000,
        '1y': 31536000,
        '2y': 63072000,
        '5y': 157680000,
      };

      const secondsBack = periodMap[period] || 2592000;
      const startTime = now - secondsBack;

      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startTime}&period2=${now}&interval=1d`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const result = data?.chart?.result?.[0];
      
      if (!result) {
        return this.generateMockHistoricalData(symbol, period);
      }

      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0];
      
      return timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: parseFloat((quotes.open[index] || 0).toFixed(2)),
        high: parseFloat((quotes.high[index] || 0).toFixed(2)),
        low: parseFloat((quotes.low[index] || 0).toFixed(2)),
        close: parseFloat((quotes.close[index] || 0).toFixed(2)),
        volume: quotes.volume[index] || 0
      }));

    } catch (error) {
      console.warn(`Failed to fetch historical data for ${symbol}, using mock data:`, error);
      return this.generateMockHistoricalData(symbol, period);
    }
  }

  /**
   * Generate mock historical data
   */  private generateMockHistoricalData(
    _symbol: string, // Parameter kept for interface consistency
    period: string
  ): Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }> {
    const days = period === '1d' ? 1 : period === '5d' ? 5 : period === '1mo' ? 30 : 90;
    const data = [];
    let price = 100; // Starting price

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const volatility = Math.random() * 0.04 - 0.02; // ±2%
      const open = price;
      const change = price * volatility;
      const high = open + Math.abs(change) * Math.random();
      const low = open - Math.abs(change) * Math.random();
      const close = open + change;
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000)
      });

      price = close;
    }

    return data;
  }

  /**
   * Get market movers (top gainers/losers)
   * @returns Object with gainers and losers
   */
  async getMarketMovers(): Promise<{ gainers: MarketData[]; losers: MarketData[] }> {
    const allData = await this.fetchMarketData();
    
    const sorted = [...allData].sort((a, b) => b.changePercent - a.changePercent);
    
    return {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse()
    };
  }

  /**
   * Get market summary
   * @returns Market summary statistics
   */
  async getMarketSummary(): Promise<{
    totalSymbols: number;
    gainers: number;
    losers: number;
    unchanged: number;
    avgChange: number;
  }> {
    const allData = await this.fetchMarketData();
    
    const gainers = allData.filter(item => item.changePercent > 0).length;
    const losers = allData.filter(item => item.changePercent < 0).length;
    const unchanged = allData.filter(item => item.changePercent === 0).length;
    const avgChange = allData.reduce((sum, item) => sum + item.changePercent, 0) / allData.length;

    return {
      totalSymbols: allData.length,
      gainers,
      losers,
      unchanged,
      avgChange: parseFloat(avgChange.toFixed(2))
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.lastFetch.clear();
  }

  /**
   * Get available symbols
   */
  getAvailableSymbols(): string[] {
    return [...this.symbols];
  }

  /**
   * Get crypto market data using free widget service
   * @param coins - Array of crypto symbols
   * @returns Crypto market data
   */
  async getCryptoData(coins?: string[]): Promise<MarketData[]> {
    try {
      const cryptoData = await freeWidgetService.getFreeCryptoData(coins);
      return cryptoData;
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return [];
    }
  }

  /**
   * Get forex data using free widget service
   * @param pairs - Currency pairs
   * @returns Forex market data
   */
  async getForexData(pairs?: string[]): Promise<MarketData[]> {
    try {
      const forexData = await freeWidgetService.getFreeForexData(pairs);
      return forexData;
    } catch (error) {
      console.error('Error fetching forex data:', error);
      return [];
    }
  }

  /**
   * Get economic calendar from free widget service
   * @returns Economic events
   */
  async getEconomicCalendar() {
    try {
      const calendar = await freeWidgetService.getFreeEconomicCalendar();
      return calendar;
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      return [];
    }
  }

  /**
   * Get TradingView widget configuration
   * @param symbol - Symbol for widget
   * @param theme - Widget theme
   * @returns TradingView widget config
   */
  getTradingViewWidget(symbol?: string, theme?: 'light' | 'dark') {
    return freeWidgetService.getTradingViewWidget(symbol, theme);
  }

  /**
   * Get Yahoo Finance widget HTML
   * @param symbols - Symbols for widget
   * @returns Yahoo Finance widget HTML
   */
  getYahooFinanceWidget(symbols?: string[]) {
    return freeWidgetService.getYahooFinanceWidget(symbols);
  }

  /**
   * Get TradingView chart embed code
   * @param symbol - Symbol to chart
   * @param height - Chart height
   * @returns HTML embed code
   */
  getTradingViewChartEmbed(symbol: string, height?: number) {
    return freeWidgetService.getTradingViewChartEmbed(symbol, height);
  }
}

export default new MarketDataService();
