import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap, Target, CheckCircle } from 'lucide-react';

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: number; // 0-100
  description: string;
}

interface SupportResistance {
  type: 'support' | 'resistance';
  price: number;
  strength: number;
  touchCount: number;
}

interface PatternRecognition {
  pattern: string;
  probability: number;
  targetPrice: number;
  timeframe: string;
  description: string;
}

const TechnicalAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1D');
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [supportResistance, setSupportResistance] = useState<SupportResistance[]>([]);
  const [patterns, setPatterns] = useState<PatternRecognition[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'indicators' | 'levels' | 'patterns'>('indicators');

  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'SPY', 'QQQ', 'NVDA'];
  const timeframes = ['5m', '15m', '1H', '4H', '1D', '1W'];

  useEffect(() => {
    generateTechnicalData();
  }, [selectedSymbol, timeframe]);

  const generateTechnicalData = () => {
    setLoading(true);
    
    // Simulate technical analysis data
    setTimeout(() => {
      // Generate technical indicators
      const technicalIndicators: TechnicalIndicator[] = [
        {
          name: 'RSI (14)',
          value: 45 + Math.random() * 40,
          signal: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'NEUTRAL',
          strength: Math.floor(Math.random() * 100),
          description: 'Relative Strength Index - measures overbought/oversold conditions'
        },
        {
          name: 'MACD',
          value: (Math.random() - 0.5) * 2,
          signal: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'NEUTRAL',
          strength: Math.floor(Math.random() * 100),
          description: 'Moving Average Convergence Divergence - trend following momentum indicator'
        },
        {
          name: 'Bollinger Bands',
          value: Math.random(),
          signal: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'NEUTRAL',
          strength: Math.floor(Math.random() * 100),
          description: 'Volatility indicator using standard deviation bands'
        },
        {
          name: 'Stochastic',
          value: Math.random() * 100,
          signal: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'NEUTRAL',
          strength: Math.floor(Math.random() * 100),
          description: 'Momentum oscillator comparing closing price to price range'
        },
        {
          name: 'Williams %R',
          value: -Math.random() * 100,
          signal: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'NEUTRAL',
          strength: Math.floor(Math.random() * 100),
          description: 'Momentum indicator measuring overbought/oversold levels'
        },
        {
          name: 'Moving Average (20)',
          value: 150 + Math.random() * 50,
          signal: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'NEUTRAL',
          strength: Math.floor(Math.random() * 100),
          description: '20-period Simple Moving Average trend indicator'
        }
      ];

      // Generate support/resistance levels
      const currentPrice = 150 + Math.random() * 50;
      const levels: SupportResistance[] = [
        {
          type: 'resistance',
          price: currentPrice + Math.random() * 20,
          strength: Math.floor(Math.random() * 100),
          touchCount: Math.floor(Math.random() * 10) + 1
        },
        {
          type: 'resistance',
          price: currentPrice + Math.random() * 40,
          strength: Math.floor(Math.random() * 100),
          touchCount: Math.floor(Math.random() * 8) + 1
        },
        {
          type: 'support',
          price: currentPrice - Math.random() * 20,
          strength: Math.floor(Math.random() * 100),
          touchCount: Math.floor(Math.random() * 10) + 1
        },
        {
          type: 'support',
          price: currentPrice - Math.random() * 40,
          strength: Math.floor(Math.random() * 100),
          touchCount: Math.floor(Math.random() * 8) + 1
        }
      ];

      // Generate pattern recognition
      const patternTypes = [
        'Head and Shoulders',
        'Double Top',
        'Double Bottom',
        'Ascending Triangle',
        'Descending Triangle',
        'Cup and Handle',
        'Flag Pattern',
        'Pennant Pattern'
      ];

      const recognizedPatterns: PatternRecognition[] = Array.from({ length: 3 }, () => ({
        pattern: patternTypes[Math.floor(Math.random() * patternTypes.length)],
        probability: Math.floor(Math.random() * 40) + 60, // 60-100%
        targetPrice: currentPrice + (Math.random() - 0.5) * 40,
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        description: 'Pattern detected using advanced chart analysis algorithms'
      }));

      setIndicators(technicalIndicators);
      setSupportResistance(levels);
      setPatterns(recognizedPatterns);
      setLoading(false);
    }, 1000);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'text-green-400';
      case 'SELL': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendingUp className="w-4 h-4" />;
      case 'SELL': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400';
    if (strength >= 60) return 'text-yellow-400';
    if (strength >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatValue = (indicator: TechnicalIndicator) => {
    if (indicator.name.includes('RSI') || indicator.name.includes('Stochastic')) {
      return indicator.value.toFixed(1);
    }
    if (indicator.name.includes('Williams')) {
      return indicator.value.toFixed(1);
    }
    if (indicator.name.includes('MACD')) {
      return indicator.value.toFixed(3);
    }
    if (indicator.name.includes('Moving Average')) {
      return `$${indicator.value.toFixed(2)}`;
    }
    return indicator.value.toFixed(3);
  };

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
            Technical Analysis Dashboard
          </span>
        </div>
      </div>

      <div className="terminal-content">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-terminal-text/70 mb-2">
              Symbol
            </label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
            >
              {symbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-terminal-text/70 mb-2">
              Timeframe
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
            >
              {timeframes.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('indicators')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'indicators'
                ? 'bg-terminal-accent text-terminal-bg'
                : 'border border-terminal-border text-terminal-text hover:border-terminal-accent'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Indicators
          </button>
          <button
            onClick={() => setActiveTab('levels')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'levels'
                ? 'bg-terminal-accent text-terminal-bg'
                : 'border border-terminal-border text-terminal-text hover:border-terminal-accent'
            }`}
          >
            <Target className="w-4 h-4" />
            Support/Resistance
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'patterns'
                ? 'bg-terminal-accent text-terminal-bg'
                : 'border border-terminal-border text-terminal-text hover:border-terminal-accent'
            }`}
          >
            <Zap className="w-4 h-4" />
            Patterns
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-terminal-accent animate-pulse mx-auto mb-2" />
              <p className="text-terminal-text/70">Analyzing {selectedSymbol}...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Technical Indicators */}
            {activeTab === 'indicators' && (
              <div className="space-y-4">
                <h3 className="text-terminal-text font-semibold mb-4">
                  Technical Indicators for {selectedSymbol} ({timeframe})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {indicators.map((indicator, index) => (
                    <div
                      key={index}
                      className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-terminal-text font-medium">{indicator.name}</h4>
                        <div className={`flex items-center gap-1 ${getSignalColor(indicator.signal)}`}>
                          {getSignalIcon(indicator.signal)}
                          <span className="font-semibold">{indicator.signal}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-terminal-text">
                          {formatValue(indicator)}
                        </span>
                        <div className="text-right">
                          <div className="text-sm text-terminal-text/70">Strength</div>
                          <div className={`font-semibold ${getStrengthColor(indicator.strength)}`}>
                            {indicator.strength}%
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-terminal-text/70">
                        {indicator.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support & Resistance */}
            {activeTab === 'levels' && (
              <div className="space-y-4">
                <h3 className="text-terminal-text font-semibold mb-4">
                  Support & Resistance Levels for {selectedSymbol}
                </h3>
                <div className="space-y-3">
                  {supportResistance.map((level, index) => (
                    <div
                      key={index}
                      className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded text-sm font-semibold ${
                            level.type === 'resistance' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {level.type.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-lg font-bold text-terminal-text">
                              ${level.price.toFixed(2)}
                            </div>
                            <div className="text-sm text-terminal-text/70">
                              {level.touchCount} touch{level.touchCount !== 1 ? 'es' : ''}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-terminal-text/70">Strength</div>
                          <div className={`font-semibold ${getStrengthColor(level.strength)}`}>
                            {level.strength}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pattern Recognition */}
            {activeTab === 'patterns' && (
              <div className="space-y-4">
                <h3 className="text-terminal-text font-semibold mb-4">
                  Chart Patterns for {selectedSymbol}
                </h3>
                <div className="space-y-3">
                  {patterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-terminal-accent" />
                          <div>
                            <h4 className="text-terminal-text font-semibold">{pattern.pattern}</h4>
                            <div className="text-sm text-terminal-text/70">
                              Timeframe: {pattern.timeframe}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-terminal-text/70">Probability</div>
                          <div className="font-semibold text-terminal-accent">
                            {pattern.probability}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-terminal-text/70">Target Price</div>
                          <div className="text-lg font-bold text-terminal-text">
                            ${pattern.targetPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-xs text-terminal-text/70 max-w-xs">
                          {pattern.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TechnicalAnalysis;
