import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, ThermometerSun, Brain } from 'lucide-react';

interface SentimentData {
  fearGreedIndex: number;
  vixLevel: number;
  marketSentiment: 'EXTREME_FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME_GREED';
  socialSentiment: number; // -100 to 100
  putCallRatio: number;
  volatilityTrend: 'INCREASING' | 'DECREASING' | 'STABLE';
}

interface SentimentIndicator {
  name: string;
  value: number;
  status: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  description: string;
  change24h: number;
}

interface MarketMood {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

const MarketSentiment: React.FC = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [indicators, setIndicators] = useState<SentimentIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  const timeframes = ['1H', '4H', '1D', '1W', '1M'];

  useEffect(() => {
    generateSentimentData();
    const interval = setInterval(generateSentimentData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const generateSentimentData = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Generate sentiment data
      const fearGreedIndex = Math.floor(Math.random() * 100);
      const vixLevel = 12 + Math.random() * 40; // VIX typically ranges 12-52
      
      let marketSentiment: SentimentData['marketSentiment'];
      if (fearGreedIndex <= 20) marketSentiment = 'EXTREME_FEAR';
      else if (fearGreedIndex <= 40) marketSentiment = 'FEAR';
      else if (fearGreedIndex <= 60) marketSentiment = 'NEUTRAL';
      else if (fearGreedIndex <= 80) marketSentiment = 'GREED';
      else marketSentiment = 'EXTREME_GREED';

      const sentiment: SentimentData = {
        fearGreedIndex,
        vixLevel,
        marketSentiment,
        socialSentiment: (Math.random() - 0.5) * 200, // -100 to 100
        putCallRatio: 0.5 + Math.random() * 1, // 0.5 to 1.5
        volatilityTrend: Math.random() > 0.6 ? 'INCREASING' : Math.random() > 0.3 ? 'DECREASING' : 'STABLE'
      };

      // Generate sentiment indicators
      const sentimentIndicators: SentimentIndicator[] = [
        {
          name: 'VIX Fear Index',
          value: vixLevel,
          status: vixLevel > 25 ? 'BEARISH' : vixLevel < 15 ? 'BULLISH' : 'NEUTRAL',
          description: 'Volatility Index measuring market fear and uncertainty',
          change24h: (Math.random() - 0.5) * 10
        },
        {
          name: 'Put/Call Ratio',
          value: sentiment.putCallRatio,
          status: sentiment.putCallRatio > 1.1 ? 'BEARISH' : sentiment.putCallRatio < 0.8 ? 'BULLISH' : 'NEUTRAL',
          description: 'Ratio of put options to call options traded',
          change24h: (Math.random() - 0.5) * 0.4
        },
        {
          name: 'Social Sentiment',
          value: sentiment.socialSentiment,
          status: sentiment.socialSentiment > 20 ? 'BULLISH' : sentiment.socialSentiment < -20 ? 'BEARISH' : 'NEUTRAL',
          description: 'Aggregate social media and news sentiment analysis',
          change24h: (Math.random() - 0.5) * 40
        },
        {
          name: 'Market Momentum',
          value: Math.random() * 100,
          status: Math.random() > 0.6 ? 'BULLISH' : Math.random() > 0.3 ? 'BEARISH' : 'NEUTRAL',
          description: 'Overall market momentum based on price action',
          change24h: (Math.random() - 0.5) * 20
        },
        {
          name: 'Institutional Flow',
          value: (Math.random() - 0.5) * 100,
          status: Math.random() > 0.6 ? 'BULLISH' : Math.random() > 0.3 ? 'BEARISH' : 'NEUTRAL',
          description: 'Net institutional money flow into the market',
          change24h: (Math.random() - 0.5) * 30
        }
      ];

      setSentimentData(sentiment);    setIndicators(sentimentIndicators);
      setLoading(false);
    }, 800);
  };

  const getSentimentBg = (sentiment: SentimentData['marketSentiment']) => {
    switch (sentiment) {
      case 'EXTREME_FEAR': return 'bg-red-600/20 border-red-600/30';
      case 'FEAR': return 'bg-red-400/20 border-red-400/30';
      case 'NEUTRAL': return 'bg-yellow-400/20 border-yellow-400/30';
      case 'GREED': return 'bg-green-400/20 border-green-400/30';
      case 'EXTREME_GREED': return 'bg-green-600/20 border-green-600/30';
    }
  };

  const getMarketMood = (sentiment: SentimentData['marketSentiment']): MarketMood => {
    switch (sentiment) {
      case 'EXTREME_FEAR':
        return {
          emoji: '😱',
          title: 'Extreme Fear',
          description: 'Maximum pessimism - potential buying opportunity',
          color: 'text-red-600'
        };
      case 'FEAR':
        return {
          emoji: '😨',
          title: 'Fear',
          description: 'High uncertainty and selling pressure',
          color: 'text-red-400'
        };
      case 'NEUTRAL':
        return {
          emoji: '😐',
          title: 'Neutral',
          description: 'Balanced market sentiment',
          color: 'text-yellow-400'
        };
      case 'GREED':
        return {
          emoji: '😄',
          title: 'Greed',
          description: 'Optimism driving prices higher',
          color: 'text-green-400'
        };
      case 'EXTREME_GREED':
        return {
          emoji: '🤑',
          title: 'Extreme Greed',
          description: 'Maximum euphoria - potential selling opportunity',
          color: 'text-green-600'
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BULLISH': return 'text-green-400';
      case 'BEARISH': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'BULLISH': return <TrendingUp className="w-4 h-4" />;
      case 'BEARISH': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatValue = (indicator: SentimentIndicator) => {
    if (indicator.name.includes('VIX')) {
      return indicator.value.toFixed(1);
    }
    if (indicator.name.includes('Ratio')) {
      return indicator.value.toFixed(2);
    }
    if (indicator.name.includes('Social') || indicator.name.includes('Flow')) {
      return indicator.value > 0 ? `+${indicator.value.toFixed(0)}` : indicator.value.toFixed(0);
    }
    return indicator.value.toFixed(1);
  };

  const formatChange = (change: number) => {
    return change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
  };

  if (loading || !sentimentData) {
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
              Market Sentiment Dashboard
            </span>
          </div>
        </div>
        <div className="terminal-content">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Brain className="w-8 h-8 text-terminal-accent animate-pulse mx-auto mb-2" />
              <p className="text-terminal-text/70">Analyzing market sentiment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mood = getMarketMood(sentimentData.marketSentiment);

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
            Market Sentiment Dashboard
          </span>
        </div>
      </div>

      <div className="terminal-content">
        {/* Timeframe Selector */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-terminal-text font-semibold">Market Sentiment Analysis</h2>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
          >
            {timeframes.map((tf) => (
              <option key={tf} value={tf}>
                {tf}
              </option>
            ))}
          </select>
        </div>

        {/* Main Sentiment Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Fear & Greed Index */}
          <div className={`border rounded-md p-6 text-center ${getSentimentBg(sentimentData.marketSentiment)}`}>
            <div className="text-4xl mb-2">{mood.emoji}</div>
            <div className="text-3xl font-bold text-terminal-text mb-1">
              {sentimentData.fearGreedIndex}
            </div>
            <div className={`font-semibold mb-2 ${mood.color}`}>
              {mood.title}
            </div>
            <p className="text-sm text-terminal-text/70">
              {mood.description}
            </p>
          </div>

          {/* VIX Level */}
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-6 text-center">
            <ThermometerSun className="w-8 h-8 text-terminal-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-terminal-text mb-1">
              {sentimentData.vixLevel.toFixed(1)}
            </div>
            <div className="text-terminal-text/70 font-medium mb-2">
              VIX Volatility Index
            </div>
            <div className={`text-sm ${
              sentimentData.vixLevel > 25 ? 'text-red-400' : 
              sentimentData.vixLevel < 15 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {sentimentData.vixLevel > 25 ? 'High Fear' : 
               sentimentData.vixLevel < 15 ? 'Low Fear' : 'Moderate'}
            </div>
          </div>

          {/* Volatility Trend */}
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-6 text-center">
            <Zap className="w-8 h-8 text-terminal-accent mx-auto mb-2" />
            <div className="text-xl font-bold text-terminal-text mb-1">
              {sentimentData.volatilityTrend}
            </div>
            <div className="text-terminal-text/70 font-medium mb-2">
              Volatility Trend
            </div>
            <div className={`text-sm ${
              sentimentData.volatilityTrend === 'INCREASING' ? 'text-red-400' : 
              sentimentData.volatilityTrend === 'DECREASING' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {sentimentData.volatilityTrend === 'INCREASING' ? 'Rising' : 
               sentimentData.volatilityTrend === 'DECREASING' ? 'Falling' : 'Stable'}
            </div>
          </div>
        </div>

        {/* Sentiment Indicators */}
        <div className="space-y-4">
          <h3 className="text-terminal-text font-semibold">Sentiment Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicators.map((indicator, index) => (
              <div
                key={index}
                className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-terminal-text font-medium">{indicator.name}</h4>
                  <div className={`flex items-center gap-1 ${getStatusColor(indicator.status)}`}>
                    {getStatusIcon(indicator.status)}
                    <span className="font-semibold text-sm">{indicator.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-terminal-text">
                    {formatValue(indicator)}
                  </span>
                  <div className={`text-sm font-mono ${
                    indicator.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatChange(indicator.change24h)}
                  </div>
                </div>
                <p className="text-xs text-terminal-text/70">
                  {indicator.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Sentiment Bar */}
        <div className="mt-6 bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-terminal-text font-medium">Social Sentiment</h4>
            <span className={`font-bold ${
              sentimentData.socialSentiment > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {sentimentData.socialSentiment > 0 ? '+' : ''}{sentimentData.socialSentiment.toFixed(0)}
            </span>
          </div>
          <div className="w-full bg-terminal-bg/50 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                sentimentData.socialSentiment > 0 ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{ 
                width: `${Math.abs(sentimentData.socialSentiment)}%`,
                marginLeft: sentimentData.socialSentiment < 0 ? `${100 - Math.abs(sentimentData.socialSentiment)}%` : '0'
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-terminal-text/70 mt-1">
            <span>Bearish</span>
            <span>Neutral</span>
            <span>Bullish</span>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={generateSentimentData}
            className="px-4 py-2 bg-terminal-accent text-terminal-bg rounded-md hover:bg-terminal-accent/80 transition-colors"
          >
            Refresh Sentiment Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketSentiment;
