import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, TrendingDown, Activity, Eye, BarChart3, Clock, AlertTriangle, Target, Zap, Users } from 'lucide-react';

interface DarkPoolTrade {
  timestamp: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  estimatedValue: number;
  institution: string;
  confidence: number;
}

interface InstitutionalFlow {
  symbol: string;
  name: string;
  buyVolume: number;
  sellVolume: number;
  netFlow: number;
  avgPrice: number;
  institutions: number;
  darkPoolPercentage: number;
  timeframe: string;
}

interface LargeOrder {
  symbol: string;
  type: 'block' | 'iceberg' | 'sweep';
  side: 'buy' | 'sell';
  size: number;
  price: number;
  venue: string;
  timestamp: string;
  detected: string;
}

interface SmartMoneyIndicator {
  name: string;
  value: number;
  change: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  description: string;
  strength: number;
}

const InstitutionalFlow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'darkpool' | 'flows' | 'orders' | 'smartmoney' | 'analytics'>('darkpool');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [loading, setLoading] = useState(false);

  // Mock data generators
  const generateDarkPoolTrades = (): DarkPoolTrade[] => {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
    const institutions = ['Goldman Sachs', 'JP Morgan', 'BlackRock', 'Vanguard', 'State Street', 'Citadel', 'Bridgewater', 'Point72'];
    
    return Array.from({ length: 20 }, (_, i) => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const size = Math.floor(Math.random() * 500000) + 50000;
      const price = 150 + Math.random() * 200;
      
      return {
        timestamp: new Date(Date.now() - i * 300000).toLocaleTimeString(),
        symbol,
        side,
        size,
        price,
        estimatedValue: size * price,
        institution: institutions[Math.floor(Math.random() * institutions.length)],
        confidence: 0.7 + Math.random() * 0.3
      };
    });
  };

  const generateInstitutionalFlows = (): InstitutionalFlow[] => {
    const stocks = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corp.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.' },
      { symbol: 'META', name: 'Meta Platforms' },
      { symbol: 'NFLX', name: 'Netflix Inc.' },
      { symbol: 'JPM', name: 'JPMorgan Chase' },
      { symbol: 'JNJ', name: 'Johnson & Johnson' }
    ];

    return stocks.map(stock => {
      const buyVolume = Math.floor(Math.random() * 10000000) + 1000000;
      const sellVolume = Math.floor(Math.random() * 10000000) + 1000000;
      
      return {
        ...stock,
        buyVolume,
        sellVolume,
        netFlow: buyVolume - sellVolume,
        avgPrice: 150 + Math.random() * 200,
        institutions: Math.floor(Math.random() * 50) + 10,
        darkPoolPercentage: 20 + Math.random() * 40,
        timeframe: selectedTimeframe
      };
    });
  };

  const generateLargeOrders = (): LargeOrder[] => {
    const symbols = ['SPY', 'QQQ', 'IWM', 'AAPL', 'MSFT', 'TSLA'];
    const types = ['block', 'iceberg', 'sweep'] as const;
    const venues = ['NYSE', 'NASDAQ', 'BATS', 'EDGX', 'Dark Pool', 'IEX'];
    
    return Array.from({ length: 15 }, (_, i) => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      
      return {
        symbol,
        type,
        side,
        size: Math.floor(Math.random() * 1000000) + 100000,
        price: 150 + Math.random() * 200,
        venue: venues[Math.floor(Math.random() * venues.length)],
        timestamp: new Date(Date.now() - i * 120000).toLocaleTimeString(),
        detected: `${Math.floor(Math.random() * 30) + 1} min ago`
      };
    });
  };

  const generateSmartMoneyIndicators = (): SmartMoneyIndicator[] => {
    return [
      {
        name: 'Institutional Buying Pressure',
        value: 67,
        change: 5.2,
        signal: 'bullish',
        description: 'Large cap buying activity increased',
        strength: 0.75
      },
      {
        name: 'Dark Pool Activity Index',
        value: 43,
        change: -2.1,
        signal: 'bearish',
        description: 'Reduced dark pool volume suggests distribution',
        strength: 0.65
      },
      {
        name: 'Options Flow Sentiment',
        value: 78,
        change: 8.3,
        signal: 'bullish',
        description: 'Heavy call buying in tech sector',
        strength: 0.85
      },
      {
        name: 'Block Trade Momentum',
        value: 52,
        change: 1.7,
        signal: 'neutral',
        description: 'Balanced institutional activity',
        strength: 0.45
      },
      {
        name: 'Smart Money Confidence',
        value: 71,
        change: 3.8,
        signal: 'bullish',
        description: 'Institutional positioning remains positive',
        strength: 0.70
      },
      {
        name: 'Insider Activity Score',
        value: 39,
        change: -4.2,
        signal: 'bearish',
        description: 'Increased insider selling detected',
        strength: 0.60
      }
    ];
  };

  const [darkPoolTrades, setDarkPoolTrades] = useState<DarkPoolTrade[]>([]);
  const [institutionalFlows, setInstitutionalFlows] = useState<InstitutionalFlow[]>([]);
  const [largeOrders, setLargeOrders] = useState<LargeOrder[]>([]);
  const [smartMoneyIndicators, setSmartMoneyIndicators] = useState<SmartMoneyIndicator[]>([]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setDarkPoolTrades(generateDarkPoolTrades());
      setInstitutionalFlows(generateInstitutionalFlows());
      setLargeOrders(generateLargeOrders());
      setSmartMoneyIndicators(generateSmartMoneyIndicators());
      setLoading(false);
    }, 1200);
  };

  const TabButton: React.FC<{ id: string; icon: React.ReactNode; label: string }> = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        activeTab === id
          ? 'bg-terminal-accent text-terminal-bg font-semibold'
          : 'border border-terminal-border text-terminal-text hover:border-terminal-accent'
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  const formatValue = (value: number): string => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="terminal-window terminal-glow">
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-terminal-accent font-semibold">
              Institutional Flow Tracker
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-terminal-text mb-2 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-terminal-accent" />
                Smart Money Flow Analysis
              </h2>
              <p className="text-terminal-text/70">
                Track institutional trading activity, dark pool flows, and large order detection
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text"
              >
                <option value="1H">1 Hour</option>
                <option value="4H">4 Hours</option>
                <option value="1D">1 Day</option>
                <option value="1W">1 Week</option>
                <option value="1M">1 Month</option>
              </select>
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-terminal-accent text-terminal-bg rounded-md hover:bg-terminal-accent/80 disabled:opacity-50"
              >
                <Eye className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                Scan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3">
        <TabButton 
          id="darkpool" 
          icon={<Eye className="w-4 h-4" />} 
          label="Dark Pool Prints" 
        />
        <TabButton 
          id="flows" 
          icon={<Activity className="w-4 h-4" />} 
          label="Institutional Flows" 
        />
        <TabButton 
          id="orders" 
          icon={<BarChart3 className="w-4 h-4" />} 
          label="Large Orders" 
        />
        <TabButton 
          id="smartmoney" 
          icon={<Target className="w-4 h-4" />} 
          label="Smart Money Signals" 
        />
        <TabButton 
          id="analytics" 
          icon={<Zap className="w-4 h-4" />} 
          label="Flow Analytics" 
        />
      </div>

      {/* Dark Pool Prints Tab */}
      {activeTab === 'darkpool' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Dark Pool Trade Detection
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left py-3 text-terminal-text/70">Time</th>
                    <th className="text-left py-3 text-terminal-text/70">Symbol</th>
                    <th className="text-center py-3 text-terminal-text/70">Side</th>
                    <th className="text-right py-3 text-terminal-text/70">Size</th>
                    <th className="text-right py-3 text-terminal-text/70">Price</th>
                    <th className="text-right py-3 text-terminal-text/70">Value</th>
                    <th className="text-left py-3 text-terminal-text/70">Institution</th>
                    <th className="text-center py-3 text-terminal-text/70">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {darkPoolTrades.map((trade, index) => (
                    <tr key={index} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                      <td className="py-3 text-terminal-text font-mono">{trade.timestamp}</td>
                      <td className="py-3">
                        <span className="font-semibold text-terminal-text">{trade.symbol}</span>
                      </td>
                      <td className="text-center py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          trade.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.side === 'buy' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {trade.side.toUpperCase()}
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        {formatVolume(trade.size)}
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        ${trade.price.toFixed(2)}
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono font-bold">
                        {formatValue(trade.estimatedValue)}
                      </td>
                      <td className="py-3 text-terminal-text/70 text-xs">
                        {trade.institution}
                      </td>
                      <td className="text-center py-3">
                        <div className="flex items-center justify-center">
                          <div className="w-12 bg-terminal-border rounded-full h-2">
                            <div 
                              className="bg-terminal-accent h-2 rounded-full"
                              style={{ width: `${trade.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-terminal-text/70 ml-2">
                            {(trade.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Flows Tab */}
      {activeTab === 'flows' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Institutional Money Flow Analysis
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left py-3 text-terminal-text/70">Symbol</th>
                    <th className="text-right py-3 text-terminal-text/70">Buy Volume</th>
                    <th className="text-right py-3 text-terminal-text/70">Sell Volume</th>
                    <th className="text-right py-3 text-terminal-text/70">Net Flow</th>
                    <th className="text-right py-3 text-terminal-text/70">Avg Price</th>
                    <th className="text-center py-3 text-terminal-text/70">Institutions</th>
                    <th className="text-right py-3 text-terminal-text/70">Dark Pool %</th>
                  </tr>
                </thead>
                <tbody>
                  {institutionalFlows.map((flow) => (
                    <tr key={flow.symbol} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                      <td className="py-3">
                        <div>
                          <div className="font-semibold text-terminal-text">{flow.symbol}</div>
                          <div className="text-xs text-terminal-text/50">{flow.name}</div>
                        </div>
                      </td>
                      <td className="text-right py-3 text-green-400 font-mono">
                        {formatVolume(flow.buyVolume)}
                      </td>
                      <td className="text-right py-3 text-red-400 font-mono">
                        {formatVolume(flow.sellVolume)}
                      </td>
                      <td className="text-right py-3">
                        <div className={`font-mono font-bold ${
                          flow.netFlow >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {flow.netFlow >= 0 ? '+' : ''}{formatVolume(flow.netFlow)}
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        ${flow.avgPrice.toFixed(2)}
                      </td>
                      <td className="text-center py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-3 h-3 text-terminal-accent" />
                          <span className="text-terminal-text font-mono">{flow.institutions}</span>
                        </div>
                      </td>
                      <td className="text-right py-3">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-terminal-text font-mono">{flow.darkPoolPercentage.toFixed(1)}%</span>
                          <div className="w-12 bg-terminal-border rounded-full h-2">
                            <div 
                              className="bg-purple-400 h-2 rounded-full"
                              style={{ width: `${flow.darkPoolPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Large Orders Tab */}
      {activeTab === 'orders' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Large Order Detection System
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left py-3 text-terminal-text/70">Symbol</th>
                    <th className="text-center py-3 text-terminal-text/70">Type</th>
                    <th className="text-center py-3 text-terminal-text/70">Side</th>
                    <th className="text-right py-3 text-terminal-text/70">Size</th>
                    <th className="text-right py-3 text-terminal-text/70">Price</th>
                    <th className="text-left py-3 text-terminal-text/70">Venue</th>
                    <th className="text-center py-3 text-terminal-text/70">Detected</th>
                  </tr>
                </thead>
                <tbody>
                  {largeOrders.map((order, index) => (
                    <tr key={index} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                      <td className="py-3">
                        <span className="font-semibold text-terminal-text">{order.symbol}</span>
                      </td>
                      <td className="text-center py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                          order.type === 'block' ? 'bg-blue-500/20 text-blue-400' :
                          order.type === 'iceberg' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {order.type === 'block' && <BarChart3 className="w-3 h-3" />}
                          {order.type === 'iceberg' && <Eye className="w-3 h-3" />}
                          {order.type === 'sweep' && <Zap className="w-3 h-3" />}
                          {order.type.toUpperCase()}
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.side === 'buy' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {order.side.toUpperCase()}
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono font-bold">
                        {formatVolume(order.size)}
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        ${order.price.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.venue === 'Dark Pool' ? 'bg-gray-500/20 text-gray-400' : 'bg-terminal-accent/20 text-terminal-accent'
                        }`}>
                          {order.venue}
                        </span>
                      </td>
                      <td className="text-center py-3 text-terminal-text/70 font-mono text-xs">
                        {order.detected}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Smart Money Signals Tab */}
      {activeTab === 'smartmoney' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {smartMoneyIndicators.map((indicator, index) => (
            <div key={index} className="terminal-window">
              <div className="terminal-header">
                <div className="flex items-center gap-2">
                  <div className="terminal-dot red"></div>
                  <div className="terminal-dot yellow"></div>
                  <div className="terminal-dot green"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-terminal-accent font-semibold text-sm">
                    {indicator.name}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-terminal-text">{indicator.value}</div>
                    <div className={`flex items-center gap-1 text-sm ${
                      indicator.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {indicator.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {indicator.change >= 0 ? '+' : ''}{indicator.change.toFixed(1)}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    indicator.signal === 'bullish' ? 'bg-green-500/20 text-green-400' :
                    indicator.signal === 'bearish' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {indicator.signal.toUpperCase()}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-terminal-text/70 mb-1">
                    <span>Signal Strength</span>
                    <span>{(indicator.strength * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-terminal-border rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        indicator.strength > 0.7 ? 'bg-green-400' :
                        indicator.strength > 0.5 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${indicator.strength * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-sm text-terminal-text/70">
                  {indicator.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flow Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Summary */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">Flow Summary</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-terminal-text">Total Dark Pool Volume</span>
                    <span className="text-terminal-accent font-bold">$2.4B</span>
                  </div>
                  <div className="text-xs text-terminal-text/70">
                    +12.3% vs yesterday
                  </div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-terminal-text">Block Trades Detected</span>
                    <span className="text-green-400 font-bold">1,247</span>
                  </div>
                  <div className="text-xs text-terminal-text/70">
                    Above average activity
                  </div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-terminal-text">Smart Money Sentiment</span>
                    <span className="text-blue-400 font-bold">Bullish</span>
                  </div>
                  <div className="text-xs text-terminal-text/70">
                    Net institutional buying
                  </div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-terminal-text">Options Flow Bias</span>
                    <span className="text-purple-400 font-bold">Call Heavy</span>
                  </div>
                  <div className="text-xs text-terminal-text/70">
                    2.3:1 call/put ratio
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert System */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">Flow Alerts</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-semibold">Large Sell Block</span>
                  </div>
                  <div className="text-sm text-terminal-text">
                    AAPL: $50M sell block detected at $175.25
                  </div>
                  <div className="text-xs text-terminal-text/70 mt-1">
                    2 minutes ago
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-semibold">Dark Pool Accumulation</span>
                  </div>
                  <div className="text-sm text-terminal-text">
                    MSFT: Significant buying pressure detected
                  </div>
                  <div className="text-xs text-terminal-text/70 mt-1">
                    5 minutes ago
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Unusual Options Activity</span>
                  </div>
                  <div className="text-sm text-terminal-text">
                    TSLA: 10x normal call volume on Jun $200 calls
                  </div>
                  <div className="text-xs text-terminal-text/70 mt-1">
                    8 minutes ago
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-semibold">Iceberg Order</span>
                  </div>
                  <div className="text-sm text-terminal-text">
                    SPY: Large iceberg order at $420 support
                  </div>
                  <div className="text-xs text-terminal-text/70 mt-1">
                    12 minutes ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionalFlow;
