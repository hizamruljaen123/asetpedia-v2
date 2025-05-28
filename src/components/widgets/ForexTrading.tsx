import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Globe, RefreshCw, BarChart3, DollarSign, Zap, Activity, AlertCircle, Target, Calendar } from 'lucide-react';

interface CurrencyPair {
  pair: string;
  base: string;
  quote: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  spread: number;
  pip: number;
}

interface CentralBankRate {
  country: string;
  currency: string;
  rate: number;
  nextMeeting: string;
  lastChange: string;
  direction: 'up' | 'down' | 'hold';
}

interface EconomicEvent {
  time: string;
  currency: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
  actual?: string;
}

interface CurrencyCorrelation {
  pair1: string;
  pair2: string;
  correlation: number;
  period: string;
}

const ForexTrading: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'majors' | 'minors' | 'exotics' | 'analysis' | 'calendar' | 'correlation'>('majors');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [loading, setLoading] = useState(false);

  // Mock data generators
  const generateMajorPairs = (): CurrencyPair[] => {
    const majors = [
      { pair: 'EUR/USD', base: 'EUR', quote: 'USD' },
      { pair: 'GBP/USD', base: 'GBP', quote: 'USD' },
      { pair: 'USD/JPY', base: 'USD', quote: 'JPY' },
      { pair: 'USD/CHF', base: 'USD', quote: 'CHF' },
      { pair: 'AUD/USD', base: 'AUD', quote: 'USD' },
      { pair: 'USD/CAD', base: 'USD', quote: 'CAD' },
      { pair: 'NZD/USD', base: 'NZD', quote: 'USD' }
    ];

    return majors.map(pair => ({
      ...pair,
      price: pair.pair === 'USD/JPY' ? 150 + Math.random() * 5 : 
             pair.pair === 'EUR/USD' ? 1.08 + Math.random() * 0.05 :
             pair.pair === 'GBP/USD' ? 1.25 + Math.random() * 0.05 :
             0.6 + Math.random() * 0.8,
      change: (Math.random() - 0.5) * 0.01,
      changePercent: (Math.random() - 0.5) * 2,
      high24h: 1.0850 + Math.random() * 0.01,
      low24h: 1.0820 + Math.random() * 0.01,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      spread: 0.5 + Math.random() * 2,
      pip: 0.0001
    }));
  };

  const generateMinorPairs = (): CurrencyPair[] => {
    const minors = [
      { pair: 'EUR/GBP', base: 'EUR', quote: 'GBP' },
      { pair: 'EUR/JPY', base: 'EUR', quote: 'JPY' },
      { pair: 'GBP/JPY', base: 'GBP', quote: 'JPY' },
      { pair: 'AUD/JPY', base: 'AUD', quote: 'JPY' },
      { pair: 'CAD/JPY', base: 'CAD', quote: 'JPY' },
      { pair: 'CHF/JPY', base: 'CHF', quote: 'JPY' }
    ];

    return minors.map(pair => ({
      ...pair,
      price: pair.pair.includes('JPY') ? 80 + Math.random() * 40 : 0.8 + Math.random() * 0.4,
      change: (Math.random() - 0.5) * 0.02,
      changePercent: (Math.random() - 0.5) * 3,
      high24h: 0.8750 + Math.random() * 0.02,
      low24h: 0.8620 + Math.random() * 0.02,
      volume: Math.floor(Math.random() * 5000000) + 500000,
      spread: 1.0 + Math.random() * 3,
      pip: pair.pair.includes('JPY') ? 0.01 : 0.0001
    }));
  };

  const generateCentralBankRates = (): CentralBankRate[] => {
    return [
      { country: 'United States', currency: 'USD', rate: 5.25, nextMeeting: '2024-06-12', lastChange: '2024-05-01', direction: 'hold' },
      { country: 'European Union', currency: 'EUR', rate: 4.25, nextMeeting: '2024-06-06', lastChange: '2024-04-10', direction: 'hold' },
      { country: 'United Kingdom', currency: 'GBP', rate: 5.00, nextMeeting: '2024-06-20', lastChange: '2024-05-09', direction: 'down' },
      { country: 'Japan', currency: 'JPY', rate: -0.10, nextMeeting: '2024-06-14', lastChange: '2024-03-19', direction: 'up' },
      { country: 'Switzerland', currency: 'CHF', rate: 1.50, nextMeeting: '2024-06-15', lastChange: '2024-03-21', direction: 'hold' },
      { country: 'Canada', currency: 'CAD', rate: 4.75, nextMeeting: '2024-06-05', lastChange: '2024-04-10', direction: 'down' },
      { country: 'Australia', currency: 'AUD', rate: 4.35, nextMeeting: '2024-06-18', lastChange: '2024-05-07', direction: 'hold' },
      { country: 'New Zealand', currency: 'NZD', rate: 5.50, nextMeeting: '2024-05-22', lastChange: '2024-04-10', direction: 'down' }
    ];
  };

  const generateEconomicEvents = (): EconomicEvent[] => {
    return [
      { time: '08:30', currency: 'USD', event: 'Non-Farm Payrolls', importance: 'high', forecast: '240K', previous: '236K', actual: '243K' },
      { time: '10:00', currency: 'EUR', event: 'ECB President Speech', importance: 'high', forecast: '-', previous: '-' },
      { time: '13:00', currency: 'GBP', event: 'BoE Interest Rate Decision', importance: 'high', forecast: '5.00%', previous: '5.25%' },
      { time: '14:30', currency: 'USD', event: 'FOMC Meeting Minutes', importance: 'high', forecast: '-', previous: '-' },
      { time: '01:30', currency: 'JPY', event: 'BoJ Interest Rate Decision', importance: 'high', forecast: '-0.10%', previous: '-0.10%' },
      { time: '09:00', currency: 'CHF', event: 'SNB Chairman Speech', importance: 'medium', forecast: '-', previous: '-' },
      { time: '12:30', currency: 'CAD', event: 'BoC Rate Decision', importance: 'high', forecast: '4.50%', previous: '4.75%' },
      { time: '22:00', currency: 'AUD', event: 'RBA Meeting Minutes', importance: 'medium', forecast: '-', previous: '-' }
    ];
  };

  const generateCorrelations = (): CurrencyCorrelation[] => {
    const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF', 'USD/CAD'];
    const correlations = [];
    
    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        correlations.push({
          pair1: pairs[i],
          pair2: pairs[j],
          correlation: (Math.random() - 0.5) * 2,
          period: '30D'
        });
      }
    }
    
    return correlations;
  };

  const [majorPairs, setMajorPairs] = useState<CurrencyPair[]>([]);
  const [minorPairs, setMinorPairs] = useState<CurrencyPair[]>([]);
  const [centralBankRates, setCentralBankRates] = useState<CentralBankRate[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [correlations, setCorrelations] = useState<CurrencyCorrelation[]>([]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 15000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setMajorPairs(generateMajorPairs());
      setMinorPairs(generateMinorPairs());
      setCentralBankRates(generateCentralBankRates());
      setEconomicEvents(generateEconomicEvents());
      setCorrelations(generateCorrelations());
      setLoading(false);
    }, 800);
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

  const formatPrice = (price: number, pair: string): string => {
    return pair.includes('JPY') ? price.toFixed(2) : price.toFixed(4);
  };

  const getCurrencyFlag = (currency: string): string => {
    const flags: { [key: string]: string } = {
      'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
      'CHF': '🇨🇭', 'CAD': '🇨🇦', 'AUD': '🇦🇺', 'NZD': '🇳🇿'
    };
    return flags[currency] || '🌍';
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
              Professional Forex Trading Center
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-terminal-text mb-2 flex items-center gap-2">
                <Globe className="w-6 h-6 text-terminal-accent" />
                FX Market Center
              </h2>
              <p className="text-terminal-text/70">
                Real-time currency trading, central bank monitoring, and economic calendar
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text"
              >
                <option value="1M">1 Minute</option>
                <option value="5M">5 Minutes</option>
                <option value="15M">15 Minutes</option>
                <option value="1H">1 Hour</option>
                <option value="4H">4 Hours</option>
                <option value="1D">Daily</option>
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
          id="majors" 
          icon={<DollarSign className="w-4 h-4" />} 
          label="Major Pairs" 
        />
        <TabButton 
          id="minors" 
          icon={<BarChart3 className="w-4 h-4" />} 
          label="Minor Pairs" 
        />
        <TabButton 
          id="exotics" 
          icon={<Globe className="w-4 h-4" />} 
          label="Exotic Pairs" 
        />
        <TabButton 
          id="analysis" 
          icon={<Target className="w-4 h-4" />} 
          label="Central Banks" 
        />
        <TabButton 
          id="calendar" 
          icon={<Calendar className="w-4 h-4" />} 
          label="Economic Calendar" 
        />
        <TabButton 
          id="correlation" 
          icon={<Activity className="w-4 h-4" />} 
          label="Correlation Matrix" 
        />
      </div>

      {/* Major Pairs Tab */}
      {activeTab === 'majors' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Major Currency Pairs
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left py-3 text-terminal-text/70">Pair</th>
                    <th className="text-right py-3 text-terminal-text/70">Price</th>
                    <th className="text-right py-3 text-terminal-text/70">Change</th>
                    <th className="text-right py-3 text-terminal-text/70">24h High</th>
                    <th className="text-right py-3 text-terminal-text/70">24h Low</th>
                    <th className="text-right py-3 text-terminal-text/70">Volume</th>
                    <th className="text-right py-3 text-terminal-text/70">Spread</th>
                  </tr>
                </thead>
                <tbody>
                  {majorPairs.map((pair) => (
                    <tr key={pair.pair} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCurrencyFlag(pair.base)}</span>
                          <span className="text-lg">{getCurrencyFlag(pair.quote)}</span>
                          <span className="font-semibold text-terminal-text">{pair.pair}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono text-lg">
                        {formatPrice(pair.price, pair.pair)}
                      </td>
                      <td className="text-right py-3">
                        <div className={`flex items-center justify-end gap-1 ${
                          pair.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {pair.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span className="font-mono">{formatPrice(Math.abs(pair.change), pair.pair)}</span>
                          <span className="text-xs">({pair.changePercent.toFixed(2)}%)</span>
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        {formatPrice(pair.high24h, pair.pair)}
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        {formatPrice(pair.low24h, pair.pair)}
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        ${(pair.volume / 1000000).toFixed(1)}M
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        {pair.spread.toFixed(1)} pips
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Minor Pairs Tab */}
      {activeTab === 'minors' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Minor Currency Pairs
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left py-3 text-terminal-text/70">Pair</th>
                    <th className="text-right py-3 text-terminal-text/70">Price</th>
                    <th className="text-right py-3 text-terminal-text/70">Change</th>
                    <th className="text-right py-3 text-terminal-text/70">Volume</th>
                    <th className="text-right py-3 text-terminal-text/70">Spread</th>
                  </tr>
                </thead>
                <tbody>
                  {minorPairs.map((pair) => (
                    <tr key={pair.pair} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCurrencyFlag(pair.base)}</span>
                          <span className="text-lg">{getCurrencyFlag(pair.quote)}</span>
                          <span className="font-semibold text-terminal-text">{pair.pair}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono text-lg">
                        {formatPrice(pair.price, pair.pair)}
                      </td>
                      <td className="text-right py-3">
                        <div className={`flex items-center justify-end gap-1 ${
                          pair.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {pair.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span className="font-mono">{formatPrice(Math.abs(pair.change), pair.pair)}</span>
                          <span className="text-xs">({pair.changePercent.toFixed(2)}%)</span>
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        ${(pair.volume / 1000000).toFixed(1)}M
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        {pair.spread.toFixed(1)} pips
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Central Banks Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Central Bank Rates */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">Central Bank Rates</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {centralBankRates.map((bank) => (
                  <div key={bank.currency} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCurrencyFlag(bank.currency)}</span>
                        <div>
                          <div className="font-semibold text-terminal-text">{bank.country}</div>
                          <div className="text-xs text-terminal-text/70">{bank.currency}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-terminal-text">{bank.rate.toFixed(2)}%</div>
                        <div className={`text-xs flex items-center gap-1 ${
                          bank.direction === 'up' ? 'text-green-400' : 
                          bank.direction === 'down' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {bank.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                           bank.direction === 'down' ? <TrendingDown className="w-3 h-3" /> : 
                           <Activity className="w-3 h-3" />}
                          {bank.direction === 'hold' ? 'Hold' : bank.direction === 'up' ? 'Hawkish' : 'Dovish'}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-terminal-text/70">
                      Next Meeting: {bank.nextMeeting} | Last Change: {bank.lastChange}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">FX Market Sentiment</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-terminal-text">USD Strength Index</span>
                    <span className="text-green-400 font-bold">+0.34%</span>
                  </div>
                  <div className="w-full bg-terminal-border rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  <div className="text-xs text-terminal-text/70 mt-1">Strong</div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-terminal-text">EUR Momentum</span>
                    <span className="text-red-400 font-bold">-0.12%</span>
                  </div>
                  <div className="w-full bg-terminal-border rounded-full h-2">
                    <div className="bg-red-400 h-2 rounded-full" style={{ width: '43%' }}></div>
                  </div>
                  <div className="text-xs text-terminal-text/70 mt-1">Weak</div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-terminal-text">GBP Volatility</span>
                    <span className="text-yellow-400 font-bold">High</span>
                  </div>
                  <div className="w-full bg-terminal-border rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="text-xs text-terminal-text/70 mt-1">Election uncertainty</div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-terminal-text">JPY Safe Haven Flow</span>
                    <span className="text-blue-400 font-bold">Moderate</span>
                  </div>
                  <div className="w-full bg-terminal-border rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                  <div className="text-xs text-terminal-text/70 mt-1">Risk-off sentiment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Economic Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Today's Economic Calendar
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left py-3 text-terminal-text/70">Time</th>
                    <th className="text-left py-3 text-terminal-text/70">Currency</th>
                    <th className="text-left py-3 text-terminal-text/70">Event</th>
                    <th className="text-center py-3 text-terminal-text/70">Impact</th>
                    <th className="text-right py-3 text-terminal-text/70">Forecast</th>
                    <th className="text-right py-3 text-terminal-text/70">Previous</th>
                    <th className="text-right py-3 text-terminal-text/70">Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {economicEvents.map((event, index) => (
                    <tr key={index} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                      <td className="py-3 text-terminal-text font-mono">{event.time}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCurrencyFlag(event.currency)}</span>
                          <span className="font-semibold text-terminal-text">{event.currency}</span>
                        </div>
                      </td>
                      <td className="py-3 text-terminal-text">{event.event}</td>
                      <td className="text-center py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          event.importance === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          event.importance === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {event.importance === 'high' ? <AlertCircle className="w-3 h-3" /> :
                           event.importance === 'medium' ? <Zap className="w-3 h-3" /> :
                           <Activity className="w-3 h-3" />}
                          {event.importance.toUpperCase()}
                        </div>
                      </td>
                      <td className="text-right py-3 text-terminal-text font-mono">{event.forecast}</td>
                      <td className="text-right py-3 text-terminal-text/70 font-mono">{event.previous}</td>
                      <td className="text-right py-3">
                        {event.actual ? (
                          <span className={`font-mono font-bold ${
                            event.actual > event.forecast ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {event.actual}
                          </span>
                        ) : (
                          <span className="text-terminal-text/50">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Correlation Matrix Tab */}
      {activeTab === 'correlation' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Currency Correlation Matrix (30D)
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Correlation Table */}
              <div>
                <h3 className="text-lg font-semibold text-terminal-text mb-4">Pair Correlations</h3>
                <div className="space-y-2">
                  {correlations.slice(0, 10).map((corr, index) => (
                    <div key={index} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-text font-mono">{corr.pair1}</span>
                          <span className="text-terminal-text/50">vs</span>
                          <span className="text-terminal-text font-mono">{corr.pair2}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            Math.abs(corr.correlation) > 0.7 ? 'text-red-400' :
                            Math.abs(corr.correlation) > 0.3 ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {corr.correlation.toFixed(2)}
                          </span>
                          <div className="w-16 bg-terminal-border rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                corr.correlation > 0 ? 'bg-green-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Correlation Strength Guide */}
              <div>
                <h3 className="text-lg font-semibold text-terminal-text mb-4">Correlation Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                    <h4 className="font-semibold text-terminal-text mb-2">Strong Positive (+0.7 to +1.0)</h4>
                    <p className="text-sm text-terminal-text/70">
                      Pairs move in the same direction. High correlation indicates similar market drivers.
                    </p>
                    <div className="mt-2 text-xs text-green-400">
                      Example: EUR/USD and GBP/USD often positively correlated
                    </div>
                  </div>

                  <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                    <h4 className="font-semibold text-terminal-text mb-2">Strong Negative (-0.7 to -1.0)</h4>
                    <p className="text-sm text-terminal-text/70">
                      Pairs move in opposite directions. Useful for hedging strategies.
                    </p>
                    <div className="mt-2 text-xs text-red-400">
                      Example: EUR/USD and USD/CHF typically negatively correlated
                    </div>
                  </div>

                  <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                    <h4 className="font-semibold text-terminal-text mb-2">Weak Correlation (-0.3 to +0.3)</h4>
                    <p className="text-sm text-terminal-text/70">
                      Pairs move independently. Good for diversification in portfolio.
                    </p>
                    <div className="mt-2 text-xs text-yellow-400">
                      Example: EUR/USD and AUD/JPY may have weak correlation
                    </div>
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

export default ForexTrading;
