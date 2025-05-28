import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChart, RefreshCw, Calculator, Calendar, Target, AlertTriangle, DollarSign, Zap } from 'lucide-react';

interface DerivativeContract {
  symbol: string;
  type: 'Future' | 'Option' | 'Swap' | 'Forward';
  underlying: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  openInterest: number;
  expiry: string;
  impliedVol?: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
}

interface FuturesData {
  symbol: string;
  contract: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  openInterest: number;
  settlement: number;
  margin: number;
}

interface SwapRate {
  tenor: string;
  rate: number;
  change: number;
  spread: number;
  volume: number;
}

const DerivativesTrading: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'futures' | 'options' | 'swaps' | 'forwards' | 'analytics'>('futures');
  const [selectedUnderlying, setSelectedUnderlying] = useState('SPX');
  const [loading, setLoading] = useState(false);

  // Mock data generators
  const generateFuturesData = (): FuturesData[] => {
    const futures = [
      { symbol: 'ES', name: 'E-mini S&P 500', underlying: 'SPX' },
      { symbol: 'NQ', name: 'E-mini NASDAQ', underlying: 'NDX' },
      { symbol: 'YM', name: 'E-mini Dow', underlying: 'DJI' },
      { symbol: 'RTY', name: 'E-mini Russell 2000', underlying: 'RUT' },
      { symbol: 'CL', name: 'Crude Oil', underlying: 'WTI' },
      { symbol: 'GC', name: 'Gold', underlying: 'GOLD' },
      { symbol: 'SI', name: 'Silver', underlying: 'SILVER' },
      { symbol: 'ZB', name: '30-Year T-Bond', underlying: 'BONDS' },
      { symbol: 'ZN', name: '10-Year T-Note', underlying: 'NOTES' },
      { symbol: 'EU', name: 'EUR/USD', underlying: 'EURUSD' }
    ];

    return futures.map(future => ({
      symbol: future.symbol,
      contract: `${future.symbol}M24`,
      price: 4200 + Math.random() * 800,
      change: (Math.random() - 0.5) * 50,
      changePercent: (Math.random() - 0.5) * 2,
      volume: Math.floor(Math.random() * 500000) + 100000,
      openInterest: Math.floor(Math.random() * 1000000) + 500000,
      settlement: 4180 + Math.random() * 840,
      margin: Math.floor(Math.random() * 15000) + 5000
    }));
  };

  const generateOptionsChain = (): DerivativeContract[] => {
    const options = [];
    const basePrice = 420;
    
    for (let i = -10; i <= 10; i++) {
      const strike = basePrice + (i * 5);
      
      // Call option
      options.push({
        symbol: `SPX${strike}C`,
        type: 'Option' as const,
        underlying: selectedUnderlying,
        price: Math.max(0.1, basePrice - strike + Math.random() * 10),
        change: (Math.random() - 0.5) * 2,
        changePercent: (Math.random() - 0.5) * 20,
        volume: Math.floor(Math.random() * 10000),
        openInterest: Math.floor(Math.random() * 50000),
        expiry: '2024-06-21',
        impliedVol: 0.15 + Math.random() * 0.25,
        delta: Math.random() * (strike < basePrice ? 1 : 0.3),
        gamma: Math.random() * 0.05,
        theta: -Math.random() * 0.5,
        vega: Math.random() * 0.3
      });
      
      // Put option
      options.push({
        symbol: `SPX${strike}P`,
        type: 'Option' as const,
        underlying: selectedUnderlying,
        price: Math.max(0.1, strike - basePrice + Math.random() * 10),
        change: (Math.random() - 0.5) * 2,
        changePercent: (Math.random() - 0.5) * 20,
        volume: Math.floor(Math.random() * 10000),
        openInterest: Math.floor(Math.random() * 50000),
        expiry: '2024-06-21',
        impliedVol: 0.15 + Math.random() * 0.25,
        delta: -Math.random() * (strike > basePrice ? 1 : 0.3),
        gamma: Math.random() * 0.05,
        theta: -Math.random() * 0.5,
        vega: Math.random() * 0.3
      });
    }
    
    return options.sort((a, b) => 
      parseInt(a.symbol.match(/\d+/)?.[0] || '0') - parseInt(b.symbol.match(/\d+/)?.[0] || '0')
    );
  };

  const generateSwapRates = (): SwapRate[] => {
    const tenors = ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '15Y', '20Y', '30Y'];
    
    return tenors.map((tenor, index) => ({
      tenor,
      rate: 3.5 + (index * 0.3) + (Math.random() - 0.5) * 0.5,
      change: (Math.random() - 0.5) * 0.1,
      spread: 5 + Math.random() * 10,
      volume: Math.floor(Math.random() * 1000) + 100
    }));
  };

  const [futuresData, setFuturesData] = useState<FuturesData[]>([]);
  const [optionsData, setOptionsData] = useState<DerivativeContract[]>([]);
  const [swapRates, setSwapRates] = useState<SwapRate[]>([]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [selectedUnderlying]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setFuturesData(generateFuturesData());
      setOptionsData(generateOptionsChain());
      setSwapRates(generateSwapRates());
      setLoading(false);
    }, 1000);
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
              Derivatives Trading Center
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-terminal-text mb-2">
                Professional Derivatives Trading
              </h2>
              <p className="text-terminal-text/70">
                Futures, Options, Swaps, and Complex Derivatives Analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedUnderlying}
                onChange={(e) => setSelectedUnderlying(e.target.value)}
                className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text"
              >
                <option value="SPX">S&P 500 Index</option>
                <option value="NDX">NASDAQ 100</option>
                <option value="RUT">Russell 2000</option>
                <option value="VIX">VIX</option>
                <option value="CRUDE">Crude Oil</option>
                <option value="GOLD">Gold</option>
              </select>
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-terminal-accent text-terminal-bg rounded-md hover:bg-terminal-accent/80 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3">
        <TabButton 
          id="futures" 
          icon={<BarChart3 className="w-4 h-4" />} 
          label="Futures Market" 
        />
        <TabButton 
          id="options" 
          icon={<Calculator className="w-4 h-4" />} 
          label="Options Chain" 
        />
        <TabButton 
          id="swaps" 
          icon={<Activity className="w-4 h-4" />} 
          label="Interest Rate Swaps" 
        />
        <TabButton 
          id="forwards" 
          icon={<TrendingUp className="w-4 h-4" />} 
          label="Currency Forwards" 
        />
        <TabButton 
          id="analytics" 
          icon={<Target className="w-4 h-4" />} 
          label="Risk Analytics" 
        />
      </div>

      {/* Futures Market Tab */}
      {activeTab === 'futures' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Futures Market Data
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left py-3 text-terminal-text/70">Symbol</th>
                    <th className="text-right py-3 text-terminal-text/70">Price</th>
                    <th className="text-right py-3 text-terminal-text/70">Change</th>
                    <th className="text-right py-3 text-terminal-text/70">Volume</th>
                    <th className="text-right py-3 text-terminal-text/70">Open Interest</th>
                    <th className="text-right py-3 text-terminal-text/70">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {futuresData.map((future) => (
                    <tr key={future.symbol} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                      <td className="py-3">
                        <div>
                          <div className="font-semibold text-terminal-text">{future.contract}</div>
                          <div className="text-xs text-terminal-text/50">{future.symbol}</div>
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        ${future.price.toFixed(2)}
                      </td>
                      <td className="text-right py-3">
                        <div className={`flex items-center justify-end gap-1 ${
                          future.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {future.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span className="font-mono">{future.change.toFixed(2)}</span>
                          <span className="text-xs">({future.changePercent.toFixed(2)}%)</span>
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        {future.volume.toLocaleString()}
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        {future.openInterest.toLocaleString()}
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        ${future.margin.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Options Chain Tab */}
      {activeTab === 'options' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Options Chain - {selectedUnderlying}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calls */}
              <div>
                <h3 className="text-lg font-semibold text-terminal-text mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Call Options
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-terminal-border">
                        <th className="text-left py-2 text-terminal-text/70">Strike</th>
                        <th className="text-right py-2 text-terminal-text/70">Price</th>
                        <th className="text-right py-2 text-terminal-text/70">IV</th>
                        <th className="text-right py-2 text-terminal-text/70">Delta</th>
                        <th className="text-right py-2 text-terminal-text/70">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optionsData.filter(opt => opt.symbol.includes('C')).slice(0, 10).map((option) => (
                        <tr key={option.symbol} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                          <td className="py-2 text-terminal-text font-mono">
                            {option.symbol.match(/\d+/)?.[0]}
                          </td>
                          <td className="text-right py-2 text-terminal-text font-mono">
                            ${option.price.toFixed(2)}
                          </td>
                          <td className="text-right py-2 text-terminal-text font-mono">
                            {(option.impliedVol! * 100).toFixed(1)}%
                          </td>
                          <td className="text-right py-2 text-terminal-text font-mono">
                            {option.delta?.toFixed(3)}
                          </td>
                          <td className="text-right py-2 text-terminal-text font-mono">
                            {option.volume.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Puts */}
              <div>
                <h3 className="text-lg font-semibold text-terminal-text mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  Put Options
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-terminal-border">
                        <th className="text-left py-2 text-terminal-text/70">Strike</th>
                        <th className="text-right py-2 text-terminal-text/70">Price</th>
                        <th className="text-right py-2 text-terminal-text/70">IV</th>
                        <th className="text-right py-2 text-terminal-text/70">Delta</th>
                        <th className="text-right py-2 text-terminal-text/70">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optionsData.filter(opt => opt.symbol.includes('P')).slice(0, 10).map((option) => (
                        <tr key={option.symbol} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                          <td className="py-2 text-terminal-text font-mono">
                            {option.symbol.match(/\d+/)?.[0]}
                          </td>
                          <td className="text-right py-2 text-terminal-text font-mono">
                            ${option.price.toFixed(2)}
                          </td>
                          <td className="text-right py-2 text-terminal-text font-mono">
                            {(option.impliedVol! * 100).toFixed(1)}%
                          </td>
                          <td className="text-right py-2 text-terminal-text font-mono">
                            {option.delta?.toFixed(3)}
                          </td>
                          <td className="text-right py-2 text-terminal-text font-mono">
                            {option.volume.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interest Rate Swaps Tab */}
      {activeTab === 'swaps' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Interest Rate Swaps Market
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Swap Rates Table */}
              <div>
                <h3 className="text-lg font-semibold text-terminal-text mb-4">USD Interest Rate Swaps</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-terminal-border">
                        <th className="text-left py-3 text-terminal-text/70">Tenor</th>
                        <th className="text-right py-3 text-terminal-text/70">Rate</th>
                        <th className="text-right py-3 text-terminal-text/70">Change</th>
                        <th className="text-right py-3 text-terminal-text/70">Spread</th>
                        <th className="text-right py-3 text-terminal-text/70">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {swapRates.map((swap) => (
                        <tr key={swap.tenor} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                          <td className="py-3 text-terminal-text font-semibold">{swap.tenor}</td>
                          <td className="text-right py-3 text-terminal-text font-mono">
                            {swap.rate.toFixed(3)}%
                          </td>
                          <td className="text-right py-3">
                            <span className={`font-mono ${
                              swap.change >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {swap.change >= 0 ? '+' : ''}{swap.change.toFixed(3)}
                            </span>
                          </td>
                          <td className="text-right py-3 text-terminal-text font-mono">
                            {swap.spread.toFixed(1)} bps
                          </td>
                          <td className="text-right py-3 text-terminal-text font-mono">
                            ${swap.volume}M
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Yield Curve Visualization */}
              <div>
                <h3 className="text-lg font-semibold text-terminal-text mb-4">Yield Curve</h3>
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4 h-80">
                  <div className="relative h-full">
                    {/* Simple yield curve visualization */}
                    <svg className="w-full h-full">
                      <defs>
                        <linearGradient id="yieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>
                      
                      {/* Yield curve path */}
                      <path
                        d="M 20 240 Q 100 200, 200 180 T 380 160"
                        stroke="#22d3ee"
                        strokeWidth="3"
                        fill="none"
                      />
                      
                      {/* Fill area under curve */}
                      <path
                        d="M 20 240 Q 100 200, 200 180 T 380 160 L 380 260 L 20 260 Z"
                        fill="url(#yieldGradient)"
                      />
                      
                      {/* Data points */}
                      {swapRates.slice(0, 8).map((rate, index) => (
                        <circle
                          key={index}
                          cx={20 + (index * 50)}
                          cy={240 - (rate.rate * 20)}
                          r="4"
                          fill="#22d3ee"
                          className="hover:r-6 transition-all"
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Greeks */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">Portfolio Greeks</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-terminal-accent" />
                    <span className="text-sm text-terminal-text/70">Delta</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-text">+1,247</div>
                  <div className="text-xs text-green-400">Directional exposure</div>
                </div>
                
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-terminal-accent" />
                    <span className="text-sm text-terminal-text/70">Gamma</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-text">+89</div>
                  <div className="text-xs text-blue-400">Convexity risk</div>
                </div>
                
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-terminal-accent" />
                    <span className="text-sm text-terminal-text/70">Theta</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400">-156</div>
                  <div className="text-xs text-red-400">Time decay</div>
                </div>
                
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-terminal-accent" />
                    <span className="text-sm text-terminal-text/70">Vega</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-text">+234</div>
                  <div className="text-xs text-purple-400">Vol sensitivity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">Risk Metrics</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-terminal-bg/30 border border-terminal-border rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-terminal-text">VaR (95%)</span>
                  </div>
                  <span className="text-red-400 font-mono">-$47,892</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-terminal-bg/30 border border-terminal-border rounded-md">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-terminal-text">Expected Shortfall</span>
                  </div>
                  <span className="text-red-400 font-mono">-$68,124</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-terminal-bg/30 border border-terminal-border rounded-md">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span className="text-terminal-text">Max Drawdown</span>
                  </div>
                  <span className="text-yellow-400 font-mono">-12.8%</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-terminal-bg/30 border border-terminal-border rounded-md">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-terminal-text">Sharpe Ratio</span>
                  </div>
                  <span className="text-green-400 font-mono">1.47</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-terminal-bg/30 border border-terminal-border rounded-md">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-orange-400" />
                    <span className="text-terminal-text">Beta</span>
                  </div>
                  <span className="text-terminal-text font-mono">0.89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DerivativesTrading;
