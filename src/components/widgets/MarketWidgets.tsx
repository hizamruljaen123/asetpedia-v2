import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, RefreshCw } from 'lucide-react';
import type { MarketData } from '../../types';
import marketDataService from '../../services/marketDataService';
import realMarketDataService from '../../services/realMarketDataService';

interface MarketTickerProps {
  symbols?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ 
  symbols, 
  autoRefresh = true, 
  refreshInterval = 30000 
}) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stocks' | 'crypto' | 'etf'>('all');

  // Enhanced symbol list with categories
  const categorizedSymbols = {
    stocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'],
    crypto: ['BTC-USD', 'ETH-USD', 'ADA-USD'],
    etf: ['SPY', 'QQQ', 'IWM', 'DIA']
  };

  const getSymbolsToFetch = () => {
    if (symbols) return symbols;
    
    switch (selectedCategory) {
      case 'stocks': return categorizedSymbols.stocks;
      case 'crypto': return categorizedSymbols.crypto;
      case 'etf': return categorizedSymbols.etf;
      default: return [...categorizedSymbols.stocks, ...categorizedSymbols.crypto, ...categorizedSymbols.etf];
    }
  };
  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const symbolsToFetch = getSymbolsToFetch();
      
      // Try real market data service first, fallback to original service
      let data: MarketData[];
      try {
        data = await realMarketDataService.fetchRealMarketData(symbolsToFetch, forceRefresh);
      } catch (error) {
        console.warn('Real market data service failed, using fallback:', error);
        data = await marketDataService.fetchMarketData(symbolsToFetch, forceRefresh);
      }
      
      setMarketData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (autoRefresh) {
      const interval = setInterval(() => fetchData(), refreshInterval);
      return () => clearInterval(interval);
    }
  }, [selectedCategory, autoRefresh, refreshInterval]);

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleCategoryChange = (category: 'all' | 'stocks' | 'crypto' | 'etf') => {
    setSelectedCategory(category);
  };

  if (loading && marketData.length === 0) {
    return (
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title">Market Ticker</div>
        </div>
        <div className="terminal-content">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="animate-spin w-6 h-6 text-terminal-accent" />
            <span className="ml-2 text-terminal-text">Loading market data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-title">Market Ticker</div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1 hover:bg-terminal-bg/50 rounded disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-xs text-terminal-text/70">
            {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>
      <div className="terminal-content max-h-[600px] overflow-y-auto">
        {/* Category Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['all', 'stocks', 'crypto', 'etf'] as const).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                selectedCategory === category
                  ? 'bg-terminal-accent text-terminal-bg border-terminal-accent'
                  : 'border-terminal-border text-terminal-text hover:border-terminal-accent'
              }`}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-2 text-center">
            <div className="text-xs text-terminal-text/70">Total</div>
            <div className="font-bold text-terminal-text">{marketData.length}</div>
          </div>
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-2 text-center">
            <div className="text-xs text-terminal-text/70">Gainers</div>
            <div className="text-terminal-accent font-bold">
              {marketData.filter(item => item.changePercent > 0).length}
            </div>
          </div>
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-2 text-center">
            <div className="text-xs text-terminal-text/70">Losers</div>
            <div className="text-terminal-error font-bold">
              {marketData.filter(item => item.changePercent < 0).length}
            </div>
          </div>
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-2 text-center">
            <div className="text-xs text-terminal-text/70">Avg Change</div>
            <div className={`font-bold ${
              marketData.reduce((sum, item) => sum + item.changePercent, 0) / marketData.length >= 0 
                ? 'text-terminal-accent' 
                : 'text-terminal-error'
            }`}>
              {marketData.length > 0 
                ? (marketData.reduce((sum, item) => sum + item.changePercent, 0) / marketData.length).toFixed(2) + '%'
                : '0%'
              }
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {marketData.map((item) => (
            <MarketTickerItem key={item.symbol} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface MarketTickerItemProps {
  data: MarketData;
}

const MarketTickerItem: React.FC<MarketTickerItemProps> = ({ data }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-terminal-accent';
    if (change < 0) return 'text-terminal-error';
    return 'text-terminal-text';
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <div className="bg-terminal-bg/20 border border-terminal-border rounded p-3 hover:bg-terminal-bg/40 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {data.change >= 0 ? (
              <TrendingUp className="w-4 h-4 text-terminal-accent" />
            ) : (
              <TrendingDown className="w-4 h-4 text-terminal-error" />
            )}
            <span className="font-bold text-terminal-text">{data.symbol}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="font-bold text-terminal-text">
              {formatPrice(data.price)}
            </div>
          </div>
          
          <div className={`font-mono ${getChangeColor(data.change)} text-right`}>
            {formatChange(data.change, data.changePercent)}
          </div>
          
          <div className="text-right text-terminal-text/70 text-sm">
            <span>Vol: {formatVolume(data.volume)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarketOverviewProps {
  title?: string;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ 
  title = "Market Overview" 
}) => {
  const [summary, setSummary] = useState({
    totalSymbols: 0,
    gainers: 0,
    losers: 0,
    unchanged: 0,
    avgChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [marketIndices, setMarketIndices] = useState<MarketData[]>([]);
  const [cryptoData, setCryptoData] = useState<MarketData[]>([]);
  const [forexData, setForexData] = useState<MarketData[]>([]);
  const [economicCalendar, setEconomicCalendar] = useState<any[]>([]);
  const [topMovers, setTopMovers] = useState<{ gainers: MarketData[]; losers: MarketData[] }>({ gainers: [], losers: [] });

  useEffect(() => {    const fetchComprehensiveData = async () => {
      try {
        // Fetch basic market summary using real data
        let summaryData;
        try {
          const marketData = await realMarketDataService.fetchRealMarketData(['SPY', 'QQQ', 'DIA', 'IWM', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']);
          summaryData = {
            totalSymbols: marketData.length,
            gainers: marketData.filter(item => item.changePercent > 0).length,
            losers: marketData.filter(item => item.changePercent < 0).length,
            unchanged: marketData.filter(item => item.changePercent === 0).length,
            avgChange: marketData.length > 0 ? marketData.reduce((sum, item) => sum + item.changePercent, 0) / marketData.length : 0
          };
        } catch (error) {
          summaryData = await marketDataService.getMarketSummary();
        }
        setSummary(summaryData);

        // Fetch major market indices with real data
        let indices;
        try {
          indices = await realMarketDataService.fetchGlobalIndices();
        } catch (error) {
          indices = await marketDataService.fetchMarketData(['SPY', 'QQQ', 'DIA', 'IWM']);
        }
        setMarketIndices(indices.slice(0, 6));

        // Fetch crypto data with real data
        let crypto;
        try {
          crypto = await realMarketDataService.fetchCryptoData();
        } catch (error) {
          crypto = await marketDataService.getCryptoData(['bitcoin', 'ethereum', 'binancecoin']);
        }
        setCryptoData(crypto.slice(0, 3));

        // Fetch forex data with real data
        let forex;
        try {
          forex = await realMarketDataService.fetchForexData();
        } catch (error) {
          forex = await marketDataService.getForexData(['EUR/USD', 'GBP/USD', 'USD/JPY']);
        }
        setForexData(forex.slice(0, 3));

        // Fetch market movers
        const movers = await marketDataService.getMarketMovers();
        setTopMovers(movers);

        // Fetch economic calendar
        const calendar = await marketDataService.getEconomicCalendar();
        setEconomicCalendar(calendar.slice(0, 3)); // Show only next 3 events

      } catch (error) {
        console.error('Error fetching comprehensive market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComprehensiveData();
    
    // Update every 5 minutes
    const interval = setInterval(fetchComprehensiveData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-dots">
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-terminal-accent font-semibold text-sm">
              {title}
            </span>
          </div>
        </div>
        <div className="terminal-content">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="animate-spin w-6 h-6 text-terminal-accent" />
            <span className="ml-2 text-terminal-text">Loading market overview...</span>
          </div>
        </div>
      </div>
    );
  }

  const marketSentiment = summary.avgChange >= 0 ? 'Bullish' : 'Bearish';
  const sentimentColor = summary.avgChange >= 0 ? 'text-terminal-accent' : 'text-terminal-error';

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
        </div>
        <div className="flex-1 text-center">
          <span className="text-terminal-accent font-semibold text-sm">
            {title}
          </span>
        </div>
      </div>
      <div className="terminal-content max-h-[600px] overflow-y-auto">
        {/* Market Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricCard
            label="Total Symbols"
            value={summary.totalSymbols.toString()}
            icon={<Activity className="w-4 h-4" />}
          />
          <MetricCard
            label="Gainers"
            value={summary.gainers.toString()}
            icon={<TrendingUp className="w-4 h-4" />}
            valueColor="text-terminal-accent"
          />
          <MetricCard
            label="Losers"
            value={summary.losers.toString()}
            icon={<TrendingDown className="w-4 h-4" />}
            valueColor="text-terminal-error"
          />
          <MetricCard
            label="Unchanged"
            value={summary.unchanged.toString()}
            icon={<Activity className="w-4 h-4" />}
          />
        </div>

        {/* Market Sentiment */}
        <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-terminal-text/70 text-sm">Market Sentiment</span>
              <div className={`text-lg font-bold ${sentimentColor}`}>
                {marketSentiment}
              </div>
            </div>
            <div>
              <span className="text-terminal-text/70 text-sm">Average Change</span>
              <div className={`text-lg font-bold ${summary.avgChange >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
                {summary.avgChange >= 0 ? '+' : ''}{summary.avgChange.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Major Indices */}
        {marketIndices.length > 0 && (
          <div className="mb-6">
            <h3 className="text-terminal-accent font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Major Indices
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {marketIndices.map((index) => (
                <div key={index.symbol} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-terminal-text">{index.symbol}</span>
                    <div className="text-right">
                      <div className="font-bold text-terminal-text">${index.price}</div>
                      <div className={`text-xs ${index.change >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
                        {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Market Movers */}
        {(topMovers.gainers.length > 0 || topMovers.losers.length > 0) && (
          <div className="mb-6">
            <h3 className="text-terminal-accent font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top Market Movers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Gainers */}
              {topMovers.gainers.length > 0 && (
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
                  <h4 className="text-terminal-accent text-sm font-semibold mb-2">Top Gainers</h4>
                  <div className="space-y-2">
                    {topMovers.gainers.slice(0, 3).map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between">
                        <span className="text-terminal-text text-sm">{stock.symbol}</span>
                        <span className="text-terminal-accent text-sm font-semibold">
                          +{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Losers */}
              {topMovers.losers.length > 0 && (
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
                  <h4 className="text-terminal-error text-sm font-semibold mb-2">Top Losers</h4>
                  <div className="space-y-2">
                    {topMovers.losers.slice(0, 3).map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between">
                        <span className="text-terminal-text text-sm">{stock.symbol}</span>
                        <span className="text-terminal-error text-sm font-semibold">
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cryptocurrency Overview */}
        {cryptoData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-terminal-accent font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Cryptocurrency
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {cryptoData.slice(0, 3).map((crypto) => (
                <div key={crypto.symbol} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-terminal-text">{crypto.symbol.toUpperCase()}</span>
                    <div className="text-right">
                      <div className="font-bold text-terminal-text">${crypto.price.toLocaleString()}</div>
                      <div className={`text-xs ${crypto.change >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
                        {crypto.change >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forex Overview */}
        {forexData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-terminal-accent font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Foreign Exchange
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {forexData.slice(0, 3).map((forex) => (
                <div key={forex.symbol} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-terminal-text">{forex.symbol}</span>
                    <div className="text-right">
                      <div className="font-bold text-terminal-text">{forex.price.toFixed(4)}</div>
                      <div className={`text-xs ${forex.change >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
                        {forex.change >= 0 ? '+' : ''}{forex.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Economic Calendar */}
        {economicCalendar.length > 0 && (
          <div className="mb-6">
            <h3 className="text-terminal-accent font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Upcoming Economic Events
            </h3>
            <div className="space-y-2">
              {economicCalendar.map((event, index) => (
                <div key={index} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-terminal-text text-sm">{event.title || 'Economic Event'}</div>
                      <div className="text-terminal-text/70 text-xs">{event.country || 'Global'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-terminal-text text-xs">{event.date || 'Today'}</div>
                      <div className={`text-xs ${
                        event.impact === 'high' ? 'text-terminal-error' :
                        event.impact === 'medium' ? 'text-terminal-warning' : 
                        'text-terminal-text/70'
                      }`}>
                        {event.impact || 'Medium'} Impact
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Hours Status */}
        <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
          <h3 className="text-terminal-accent font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Market Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-terminal-text/70 text-sm">US Markets</div>
              <div className="text-terminal-accent font-semibold">
                {new Date().getHours() >= 9 && new Date().getHours() < 16 ? 'Open' : 'Closed'}
              </div>
            </div>
            <div>
              <div className="text-terminal-text/70 text-sm">Asia Markets</div>
              <div className="text-terminal-warning font-semibold">
                {new Date().getHours() >= 21 || new Date().getHours() < 6 ? 'Open' : 'Closed'}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-terminal-border">
            <div className="text-xs text-terminal-text/50">
              Last updated: {new Date().toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  icon, 
  valueColor = "text-terminal-text" 
}) => {
  return (
    <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="text-terminal-accent">
          {icon}
        </div>
        <span className="text-xs text-terminal-text/70">
          {label}
        </span>
      </div>
      <div className={`text-xl font-bold ${valueColor}`}>
        {value}
      </div>
    </div>
  );
};
