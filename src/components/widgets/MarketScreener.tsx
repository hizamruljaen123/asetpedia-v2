import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, Filter, BarChart3, Activity } from 'lucide-react';
import realMarketDataService from '../../services/realMarketDataService';
import type { MarketData } from '../../types';

interface ScreenerFilters {
  minPrice: number;
  maxPrice: number;
  minVolume: number;
  minChangePercent: number;
  maxChangePercent: number;
  sector: string;
}

interface MarketScreenerProps {
  title?: string;
  maxResults?: number;
}

export const MarketScreener: React.FC<MarketScreenerProps> = ({
  title = "Market Screener",
  maxResults = 20
}) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [filteredData, setFilteredData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof MarketData>('changePercent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ScreenerFilters>({
    minPrice: 0,
    maxPrice: 10000,
    minVolume: 0,
    minChangePercent: -50,
    maxChangePercent: 50,
    sector: 'all'
  });

  // Comprehensive symbol list for screening
  const allSymbols = [
    // Major Tech Stocks
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'CRM', 'ORCL',
    // Financial Sector
    'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'AXP', 'BLK', 'SCHW', 'USB',
    // Healthcare
    'JNJ', 'PFE', 'UNH', 'ABBV', 'MRK', 'TMO', 'ABT', 'DHR', 'BMY', 'AMGN',
    // Consumer Goods
    'PG', 'KO', 'PEP', 'WMT', 'HD', 'MCD', 'NKE', 'SBUX', 'TGT', 'COST',
    // Energy
    'XOM', 'CVX', 'COP', 'EOG', 'SLB', 'PSX', 'VLO', 'MPC', 'OXY', 'BKR',
    // ETFs
    'SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO', 'VEA', 'VWO', 'EFA', 'EEM',
    // Crypto
    'BTC-USD', 'ETH-USD', 'ADA-USD', 'SOL-USD', 'DOT-USD', 'AVAX-USD'
  ];

  useEffect(() => {
    fetchMarketData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [marketData, searchTerm, sortField, sortDirection, filters]);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const data = await realMarketDataService.fetchRealMarketData(allSymbols);
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market data for screener:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = marketData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const meetsFilters = 
        item.price >= filters.minPrice &&
        item.price <= filters.maxPrice &&
        item.volume >= filters.minVolume &&
        item.changePercent >= filters.minChangePercent &&
        item.changePercent <= filters.maxChangePercent;

      return matchesSearch && meetsFilters;
    });

    // Sort the filtered data
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'desc' 
          ? bVal.localeCompare(aVal) 
          : aVal.localeCompare(bVal);
      }
      
      return 0;
    });

    setFilteredData(filtered.slice(0, maxResults));
  };

  const handleSort = (field: keyof MarketData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 10000,
      minVolume: 0,
      minChangePercent: -50,
      maxChangePercent: 50,
      sector: 'all'
    });
    setSearchTerm('');
  };

  const getTopGainers = () => marketData
    .filter(item => item.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const getTopLosers = () => marketData
    .filter(item => item.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  const getTopVolume = () => marketData
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

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
            <span className="text-terminal-accent font-semibold text-sm">{title}</span>
          </div>
        </div>
        <div className="terminal-content">
          <div className="flex items-center justify-center h-32">
            <Activity className="animate-pulse w-6 h-6 text-terminal-accent" />
            <span className="ml-2 text-terminal-text">Loading market screener...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
        </div>
        <div className="flex-1 text-center">
          <span className="text-terminal-accent font-semibold text-sm">{title}</span>
        </div>
      </div>
      <div className="terminal-content max-h-[700px] overflow-y-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3 text-center">
            <div className="text-xs text-terminal-text/70">Total Symbols</div>
            <div className="text-lg font-bold text-terminal-text">{marketData.length}</div>
          </div>
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3 text-center">
            <div className="text-xs text-terminal-text/70">Gainers</div>
            <div className="text-lg font-bold text-terminal-accent">
              {marketData.filter(item => item.changePercent > 0).length}
            </div>
          </div>
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3 text-center">
            <div className="text-xs text-terminal-text/70">Losers</div>
            <div className="text-lg font-bold text-terminal-error">
              {marketData.filter(item => item.changePercent < 0).length}
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-text/50" />
              <input
                type="text"
                placeholder="Search symbols or names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-terminal-surface border border-terminal-border rounded-md text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 border rounded-md transition-colors ${
                showFilters 
                  ? 'bg-terminal-accent text-terminal-bg border-terminal-accent'
                  : 'border-terminal-border text-terminal-text hover:border-terminal-accent'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={resetFilters}
              className="px-3 py-2 border border-terminal-border text-terminal-text hover:border-terminal-accent rounded-md transition-colors"
            >
              Reset
            </button>
            <button
              onClick={fetchMarketData}
              className="px-3 py-2 border border-terminal-border text-terminal-text hover:border-terminal-accent rounded-md transition-colors"
            >
              Refresh
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-terminal-text/70 mb-1">Min Price ($)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
                    className="w-full px-2 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-terminal-text/70 mb-1">Max Price ($)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                    className="w-full px-2 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-terminal-text/70 mb-1">Min Volume</label>
                  <input
                    type="number"
                    value={filters.minVolume}
                    onChange={(e) => setFilters({...filters, minVolume: Number(e.target.value)})}
                    className="w-full px-2 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-terminal-text/70 mb-1">Change % Range</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={filters.minChangePercent}
                      onChange={(e) => setFilters({...filters, minChangePercent: Number(e.target.value)})}
                      className="flex-1 px-2 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={filters.maxChangePercent}
                      onChange={(e) => setFilters({...filters, maxChangePercent: Number(e.target.value)})}
                      className="flex-1 px-2 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Table */}
        <div className="bg-terminal-bg/20 border border-terminal-border rounded-md overflow-hidden">
          <div className="bg-terminal-bg/30 border-b border-terminal-border p-2">
            <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-terminal-text/70">
              <button 
                onClick={() => handleSort('symbol')}
                className="text-left hover:text-terminal-accent transition-colors"
              >
                Symbol {sortField === 'symbol' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                onClick={() => handleSort('price')}
                className="text-right hover:text-terminal-accent transition-colors"
              >
                Price {sortField === 'price' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                onClick={() => handleSort('change')}
                className="text-right hover:text-terminal-accent transition-colors"
              >
                Change {sortField === 'change' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                onClick={() => handleSort('changePercent')}
                className="text-right hover:text-terminal-accent transition-colors"
              >
                Change % {sortField === 'changePercent' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                onClick={() => handleSort('volume')}
                className="text-right hover:text-terminal-accent transition-colors"
              >
                Volume {sortField === 'volume' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
              <div className="text-right">Action</div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredData.map((item) => (
              <div 
                key={item.symbol} 
                className="grid grid-cols-6 gap-2 p-2 border-b border-terminal-border/30 hover:bg-terminal-bg/30 transition-colors"
              >
                <div className="text-sm">
                  <div className="font-semibold text-terminal-text">{item.symbol}</div>
                  {item.name && (
                    <div className="text-xs text-terminal-text/50 truncate">{item.name}</div>
                  )}
                </div>
                <div className="text-right text-sm font-semibold text-terminal-text">
                  ${item.price.toFixed(2)}
                </div>
                <div className={`text-right text-sm font-semibold ${
                  item.change >= 0 ? 'text-terminal-accent' : 'text-terminal-error'
                }`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </div>
                <div className={`text-right text-sm font-semibold ${
                  item.changePercent >= 0 ? 'text-terminal-accent' : 'text-terminal-error'
                }`}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </div>
                <div className="text-right text-xs text-terminal-text/70">
                  {(item.volume / 1000000).toFixed(1)}M
                </div>
                <div className="text-right">
                  <button className="text-xs px-2 py-1 border border-terminal-border text-terminal-text hover:border-terminal-accent rounded transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Lists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <QuickList title="Top Gainers" data={getTopGainers()} type="gainers" />
          <QuickList title="Top Losers" data={getTopLosers()} type="losers" />
          <QuickList title="Most Active" data={getTopVolume()} type="volume" />
        </div>
      </div>
    </div>
  );
};

interface QuickListProps {
  title: string;
  data: MarketData[];
  type: 'gainers' | 'losers' | 'volume';
}

const QuickList: React.FC<QuickListProps> = ({ title, data, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'gainers': return <TrendingUp className="w-4 h-4 text-terminal-accent" />;
      case 'losers': return <TrendingDown className="w-4 h-4 text-terminal-error" />;
      case 'volume': return <BarChart3 className="w-4 h-4 text-terminal-warning" />;
    }
  };

  const getValue = (item: MarketData) => {
    switch (type) {
      case 'gainers':
      case 'losers':
        return `${item.changePercent >= 0 ? '+' : ''}${item.changePercent.toFixed(2)}%`;
      case 'volume':
        return `${(item.volume / 1000000).toFixed(1)}M`;
    }
  };
  const getValueColor = (_item: MarketData) => {
    switch (type) {
      case 'gainers': return 'text-terminal-accent';
      case 'losers': return 'text-terminal-error';
      case 'volume': return 'text-terminal-warning';
    }
  };

  return (
    <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-terminal-text mb-3">
        {getIcon()}
        {title}
      </h4>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between text-sm">
            <span className="text-terminal-text font-medium">{item.symbol}</span>
            <span className={`font-semibold ${getValueColor(item)}`}>
              {getValue(item)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketScreener;
