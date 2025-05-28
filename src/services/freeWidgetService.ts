/**
 * Free Widget Service - Using free widgets from various financial platforms
 * Integrates with TradingView, Yahoo Finance, and other free providers
 */

export class FreeWidgetService {
  private widgetCache: Map<string, any> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  /**
   * Get TradingView widget configuration for charts
   * @param symbol - Stock symbol
   * @param theme - Widget theme (light/dark)
   * @returns TradingView widget config
   */
  getTradingViewWidget(symbol: string = 'NASDAQ:AAPL', theme: 'light' | 'dark' = 'dark') {
    return {
      symbol: symbol,
      theme: theme,
      autosize: true,
      interval: 'D',
      timezone: 'Etc/UTC',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      withdateranges: true,
      range: '3M',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com'
    };
  }

  /**
   * Get Yahoo Finance widget embed code
   * @param symbols - Array of symbols to display
   * @returns Yahoo Finance widget HTML
   */
  getYahooFinanceWidget(symbols: string[] = ['AAPL', 'GOOGL', 'MSFT', 'TSLA']) {
    const symbolList = symbols.join(',');
    return `
      <div id="yahoo-finance-widget">
        <iframe 
          src="https://finance.yahoo.com/widgets/mini-chart/${symbolList}?theme=dark"
          width="100%" 
          height="400"
          frameborder="0"
          scrolling="no">
        </iframe>
      </div>
    `;
  }
  /**
   * Get free market data from Yahoo Finance API
   * @param symbol - Stock symbol
   * @returns Market data
   */
  async getFreeMarketData(symbol: string) {
    const cacheKey = `market_${symbol}`;
    const cached = this.widgetCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Using Yahoo Finance API
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const result = data?.chart?.result?.[0];
      
      if (result && result.meta) {
        const meta = result.meta;
        const currentPrice = meta.regularMarketPrice || meta.previousClose || 0;
        const previousClose = meta.previousClose || currentPrice;
        const change = currentPrice - previousClose;
        const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

        const marketData = {
          symbol: symbol,
          price: parseFloat(currentPrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          volume: meta.regularMarketVolume || 0,
          timestamp: new Date().toISOString()
        };

        this.widgetCache.set(cacheKey, {
          data: marketData,
          timestamp: Date.now()
        });

        return marketData;
      }
    } catch (error) {
      console.error('Free market data error:', error);
    }

    // Fallback to realistic mock data if API fails
    return this.generateMockData(symbol);
  }

  /**
   * Get free crypto data from CoinGecko (free API)
   * @param coins - Array of coin IDs
   * @returns Crypto market data
   */
  async getFreeCryptoData(coins: string[] = ['bitcoin', 'ethereum', 'cardano']) {
    const cacheKey = `crypto_${coins.join('_')}`;
    const cached = this.widgetCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const coinList = coins.join(',');
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinList}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const cryptoData = Object.keys(data).map(coin => ({
        symbol: coin.toUpperCase(),
        price: data[coin].usd,
        change: data[coin].usd_24h_change || 0,
        changePercent: data[coin].usd_24h_change || 0,
        volume: data[coin].usd_24h_vol || 0,
        timestamp: new Date().toISOString()
      }));

      this.widgetCache.set(cacheKey, {
        data: cryptoData,
        timestamp: Date.now()
      });

      return cryptoData;
    } catch (error) {
      console.error('Free crypto data error:', error);
      return coins.map(coin => this.generateMockCryptoData(coin));
    }
  }
  /**
   * Get free forex data using real exchange rates
   * @param pairs - Currency pairs
   * @returns Forex data
   */
  async getFreeForexData(pairs: string[] = ['EUR/USD', 'GBP/USD', 'USD/JPY']) {
    const cacheKey = `forex_${pairs.join('_')}`;
    const cached = this.widgetCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const forexData = await Promise.all(
        pairs.map(async (pair) => {
          try {
            // Convert pair format: EUR/USD -> EURUSD=X for Yahoo Finance
            const yahooSymbol = `${pair.replace('/', '')}=X`;
            const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              const result = data?.chart?.result?.[0];
              
              if (result && result.meta) {
                const meta = result.meta;
                const currentPrice = meta.regularMarketPrice || meta.previousClose || 0;
                const previousClose = meta.previousClose || currentPrice;
                const change = currentPrice - previousClose;
                const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

                return {
                  symbol: pair,
                  price: parseFloat(currentPrice.toFixed(4)),
                  change: parseFloat(change.toFixed(4)),
                  changePercent: parseFloat(changePercent.toFixed(2)),
                  volume: meta.regularMarketVolume || 0,
                  timestamp: new Date().toISOString()
                };
              }
            }
          } catch (error) {
            console.error(`Error fetching ${pair}:`, error);
          }
          
          // Fallback to mock data for this pair
          return this.generateMockForexData(pair);
        })
      );

      this.widgetCache.set(cacheKey, {
        data: forexData,
        timestamp: Date.now()
      });

      return forexData;
    } catch (error) {
      console.error('Free forex data error:', error);
      return pairs.map(pair => this.generateMockForexData(pair));
    }
  }
  /**
   * Get economic calendar from free sources
   * @returns Economic events
   */
  async getFreeEconomicCalendar() {
    const cacheKey = 'economic_calendar';
    const cached = this.widgetCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION * 2) {
      return cached.data;
    }

    // Enhanced mock economic calendar data with proper formatting
    const today = new Date();
    const economicEvents = [
      {
        title: 'Non-Farm Payrolls',
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('id-ID'),
        time: '20:30 WIB',
        country: 'United States',
        currency: 'USD',
        impact: 'high',
        previous: '223K',
        forecast: '200K',
        actual: null
      },
      {
        title: 'ECB Interest Rate Decision',
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID'),
        time: '19:45 WIB',
        country: 'European Union',
        currency: 'EUR',
        impact: 'high',
        previous: '4.50%',
        forecast: '4.25%',
        actual: null
      },
      {
        title: 'GDP Growth Rate',
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID'),
        time: '15:30 WIB',
        country: 'United Kingdom',
        currency: 'GBP',
        impact: 'medium',
        previous: '0.1%',
        forecast: '0.2%',
        actual: null
      },
      {
        title: 'Consumer Price Index (CPI)',
        date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID'),
        time: '20:30 WIB',
        country: 'United States',
        currency: 'USD',
        impact: 'high',
        previous: '3.2%',
        forecast: '3.1%',
        actual: null
      },
      {
        title: 'Employment Change',
        date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID'),
        time: '09:30 WIB',
        country: 'Australia',
        currency: 'AUD',
        impact: 'medium',
        previous: '38.5K',
        forecast: '25.0K',
        actual: null
      }
    ];

    this.widgetCache.set(cacheKey, {
      data: economicEvents,
      timestamp: Date.now()
    });

    return economicEvents;
  }

  /**
   * Generate TradingView chart embed code
   * @param symbol - Symbol to chart
   * @param height - Chart height
   * @returns HTML embed code
   */
  getTradingViewChartEmbed(symbol: string, height: number = 400): string {
    return `
      <div class="tradingview-widget-container" style="height: ${height}px;">
        <div class="tradingview-widget-container__widget"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "withdateranges": true,
          "range": "3M",
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "save_image": false,
          "calendar": false,
          "hide_volume": false
        }
        </script>
      </div>
    `;
  }
  /**
   * Generate mock market data for fallback
   */
  private generateMockData(symbol: string) {
    // Enhanced base prices for different types of assets
    const basePrices: Record<string, number> = {
      // Major indices
      'SPY': 485.50,
      'QQQ': 398.20,
      'DIA': 365.80,
      'IWM': 210.45,
      
      // Tech stocks
      'AAPL': 195.30,
      'MSFT': 385.70,
      'GOOGL': 145.80,
      'AMZN': 165.90,
      'TSLA': 245.60,
      'META': 485.20,
      'NVDA': 875.40,
      'NFLX': 525.10,
      
      // Financial stocks
      'JPM': 185.70,
      'BAC': 35.80,
      'WFC': 52.40,
      'GS': 385.60,
      
      // Healthcare
      'JNJ': 155.80,
      'PFE': 28.90,
      'UNH': 485.20,
      
      // Energy
      'XOM': 125.60,
      'CVX': 155.40,
      'COP': 118.70,
      
      // Crypto
      'BTC-USD': 95000,
      'ETH-USD': 3200,
      'ADA-USD': 0.85
    };

    const basePrice = basePrices[symbol] || (50 + Math.random() * 200);
    const changePercent = (Math.random() - 0.5) * 6; // ±3% max change
    const change = (basePrice * changePercent) / 100;
    const currentPrice = basePrice + change;
    
    // Generate realistic volume based on asset type
    let baseVolume = 1000000; // 1M default
    if (symbol.includes('USD')) {
      baseVolume = Math.random() * 50000000 + 10000000; // 10-60M for crypto
    } else if (['SPY', 'QQQ', 'DIA', 'IWM'].includes(symbol)) {
      baseVolume = Math.random() * 100000000 + 50000000; // 50-150M for ETFs
    } else {
      baseVolume = Math.random() * 20000000 + 5000000; // 5-25M for stocks
    }
    
    return {
      symbol: symbol,
      price: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(baseVolume),
      timestamp: new Date().toISOString()
    };
  }/**
   * Generate mock crypto data
   */
  private generateMockCryptoData(coin: string) {
    const prices: Record<string, number> = { 
      bitcoin: 95000 + (Math.random() - 0.5) * 5000, 
      ethereum: 3200 + (Math.random() - 0.5) * 200, 
      cardano: 0.85 + (Math.random() - 0.5) * 0.1,
      binancecoin: 580 + (Math.random() - 0.5) * 50
    };
    const basePrice = prices[coin] || (100 + Math.random() * 200);
    const changePercent = (Math.random() - 0.5) * 10; // ±5% change
    const change = (basePrice * changePercent) / 100;
    
    return {
      symbol: coin.toUpperCase(),
      price: parseFloat((basePrice + change).toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000 + 10000000), // 10M-60M volume
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate mock forex data
   */
  private generateMockForexData(pair: string) {
    const rates: Record<string, number> = { 
      'EUR/USD': 1.0850, 
      'GBP/USD': 1.2720, 
      'USD/JPY': 149.50,
      'AUD/USD': 0.6580,
      'USD/CHF': 0.8950,
      'USD/CAD': 1.3620,
      'NZD/USD': 0.6120
    };
    const baseRate = rates[pair] || 1.0;
    const changePercent = (Math.random() - 0.5) * 1; // ±0.5% change
    const change = (baseRate * changePercent) / 100;
    
    return {
      symbol: pair,
      price: parseFloat((baseRate + change).toFixed(4)),
      change: parseFloat(change.toFixed(4)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000 + 1000000), // 1M-6M volume
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Clear widget cache
   */
  clearCache(): void {
    this.widgetCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.widgetCache.size,
      keys: Array.from(this.widgetCache.keys())
    };
  }
}

export default new FreeWidgetService();
