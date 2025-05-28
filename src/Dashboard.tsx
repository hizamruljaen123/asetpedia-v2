import React, { useState, useEffect } from 'react';
import { Brain, Globe, Activity, TrendingUp, BarChart3, DollarSign, Users, Calendar, HelpCircle } from 'lucide-react';
import DashboardLayout from './components/layout/DashboardLayout';
import { NewsStream, AIMarketAnalysis } from './components/widgets/NewsWidgets';
import { 
  TradingViewAdvancedChart, 
  TradingViewMarketOverview, 
  TradingViewTicker, 
  TradingViewCryptoMarket,
  TradingViewEconomicCalendar 
} from './components/widgets/TradingViewRealWidget';
import { MetricCard, ProgressRing, MarketSentimentBadge, Tooltip } from './components/widgets/EnhancedComponents';
import aiAnalysisService from './services/aiAnalysis';

const formatSymbolForTradingView = (symbol: string): string => {
  if (symbol.includes('-USD')) {
    // For crypto pairs like BTC-USD, ETH-USD, use a common exchange like COINBASE
    return `COINBASE:${symbol.replace('-', '')}`;
  }
  // For common stocks, TradingView can often resolve them without an exchange prefix.
  // Specific prefixes can be added here if needed for disambiguation.
  // Example: if (symbol === 'SPY') return 'AMEX:SPY';
  return symbol; 
};

const Dashboard: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('SPY');

  useEffect(() => {
    // Start automated AI analysis service
    aiAnalysisService.startAutoAnalysis();
    
    return () => {
      aiAnalysisService.stopAutoAnalysis();
    };
  }, []);

  const popularSymbols = ['SPY', 'QQQ', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'BTC-USD'];

  return (
    <DashboardLayout>      {/* Enhanced Hero Section */}
      <div className="mb-10">
        <div className="terminal-window terminal-glow bg-gradient-to-br from-terminal-surface/60 to-terminal-bg/40 backdrop-blur-sm">
          <div className="terminal-header border-b-2 border-terminal-accent/20">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red animate-pulse"></div>
              <div className="terminal-dot yellow animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="terminal-dot green animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-bold text-lg tracking-wide">
                ASETPEDIA - AI-Powered Market Analysis Platform
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-terminal-text/60">
              <div className="w-2 h-2 bg-terminal-accent rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
          <div className="p-8">            <div className="text-center mb-8">
              <h1 className="hero-title-mobile font-bold text-terminal-accent mb-4 bg-gradient-to-r from-terminal-accent to-green-400 bg-clip-text text-transparent">
                Welcome to the Future of Trading
              </h1>
              <p className="text-terminal-text/80 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto px-4">
                Powered by <span className="text-terminal-accent font-semibold">Artificial Intelligence</span> • 
                <span className="text-blue-400 font-semibold"> Real-time Market Data</span> • 
                <span className="text-green-400 font-semibold"> Intelligent News Analysis</span>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <FeatureCard
                icon={<Brain className="w-8 h-8" />}
                title="Automated AI Analysis"
                description="Together AI provides automated news analysis with keywords, references, and market insights every 15 minutes"
              />
              <FeatureCard
                icon={<Activity className="w-8 h-8" />}
                title="Real-Time Market Data"
                description="TradingView professional widgets, live charts, economic calendar, and real-time market screeners"
              />
              <FeatureCard
                icon={<Globe className="w-8 h-8" />}
                title="Comprehensive Research"
                description="AI-generated keywords and references for further research, plus real economic calendar integration"
              />
            </div>
          </div>
        </div>
      </div>{/* Market Overview Grid */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-terminal-surface/40 to-terminal-bg/30 border-2 border-terminal-border/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-terminal-accent/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-terminal-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-terminal-text">Market Overview</h2>
                <p className="text-terminal-text/60 text-sm">Real-time market data and major indices</p>
              </div>
            </div>
            <div className="text-right text-xs text-terminal-text/50">
              <div>Live Data</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-terminal-accent rounded-full animate-pulse"></div>
                <span>TradingView</span>
              </div>
            </div>
          </div>          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Major Indices with Sparklines */}
              <div className="bg-terminal-bg/50 rounded-lg border border-terminal-border/30 p-4">
                <h3 className="text-lg font-semibold text-terminal-text mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-terminal-accent" />
                  Major Indices
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">                  <MetricCard
                    title="S&P 500"
                    value="4,127.83"
                    change={1.24}
                    description="US stocks"
                    icon={<BarChart3 className="w-4 h-4" />}
                    sparklineData={[4100, 4110, 4115, 4108, 4120, 4125, 4127.83]}
                  />
                  <MetricCard
                    title="NASDAQ"
                    value="12,958.44"
                    change={-0.87}
                    description="Tech stocks"
                    icon={<Activity className="w-4 h-4" />}
                    sparklineData={[12980, 12970, 12985, 12960, 12955, 12950, 12958.44]}
                  />
                  <MetricCard
                    title="DOW"
                    value="33,886.47"
                    change={0.56}
                    description="Industrial stocks"
                    icon={<TrendingUp className="w-4 h-4" />}
                    sparklineData={[33850, 33870, 33865, 33880, 33885, 33890, 33886.47]}
                  />
                  <MetricCard
                    title="VIX"
                    value="18.42"
                    change={-2.15}
                    description="Market volatility"
                    icon={<Activity className="w-4 h-4" />}
                    sparklineData={[20.1, 19.8, 19.2, 18.9, 18.6, 18.5, 18.42]}
                  />
                </div>
              </div>
              
              {/* Main Market Overview Widget */}
              <div className="bg-terminal-bg/50 rounded-lg border border-terminal-border/30 p-4">
                <TradingViewMarketOverview height={350} />
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Live Ticker */}
              <div className="bg-terminal-bg/50 rounded-lg border border-terminal-border/30 p-4">
                <h3 className="text-lg font-semibold text-terminal-text mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Live Tickers
                </h3>
                <TradingViewTicker 
                  symbols={[
                    "NASDAQ:AAPL",
                    "NASDAQ:MSFT", 
                    "NASDAQ:GOOGL",
                    "NASDAQ:AMZN",
                    "NASDAQ:TSLA",
                    "COINBASE:BTCUSD",
                    "COINBASE:ETHUSD",
                    "FX:EURUSD"
                  ]}
                  height={350}
                />
              </div>
              
              {/* Market Heat Map */}
              <div className="bg-terminal-bg/50 rounded-lg border border-terminal-border/30 p-4">
                <h3 className="text-lg font-semibold text-terminal-text mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  Sector Performance
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-500/20 border border-green-500/30 rounded p-3 text-center">
                    <div className="text-green-400 font-semibold">Technology</div>
                    <div className="text-green-300">+2.34%</div>
                  </div>
                  <div className="bg-red-500/20 border border-red-500/30 rounded p-3 text-center">
                    <div className="text-red-400 font-semibold">Energy</div>
                    <div className="text-red-300">-1.87%</div>
                  </div>
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded p-3 text-center">
                    <div className="text-blue-400 font-semibold">Healthcare</div>
                    <div className="text-blue-300">+0.92%</div>
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-3 text-center">
                    <div className="text-yellow-400 font-semibold">Financials</div>
                    <div className="text-yellow-300">+0.45%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Charts and Widgets Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-blue-900/20 to-terminal-surface/40 border-2 border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-terminal-text">Trading View Chart</h2>
                <p className="text-terminal-text/60 text-sm">Advanced charting and market analysis tools</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-terminal-text/50">
              <button className="hover:text-terminal-accent transition-colors">
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-terminal-bg/50 rounded-lg border border-terminal-border/30 p-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-terminal-text/70 mb-2">
                  Select Symbol for Live Chart
                </label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                >
                  {popularSymbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
              </div>
              <TradingViewAdvancedChart
                symbol={formatSymbolForTradingView(selectedSymbol)}
                theme="dark"
                height={500}
              />
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-900/20 to-terminal-bg/50 rounded-lg border border-orange-500/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-terminal-text">Cryptocurrency Market</h3>
                </div>
                <TradingViewCryptoMarket height={250} />
              </div>
              <div className="bg-gradient-to-br from-purple-900/20 to-terminal-bg/50 rounded-lg border border-purple-500/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-terminal-text">Economic Calendar</h3>
                </div>
                <TradingViewEconomicCalendar height={250} />
              </div>
            </div>
          </div>
        </div>
      </div>      {/* News and AI Analysis */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-green-900/20 to-terminal-surface/40 border-2 border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-terminal-text">Intelligence & News</h2>
                <p className="text-terminal-text/60 text-sm">AI-powered analysis and real-time market news</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Tooltip content="Our AI analyzes thousands of news sources every 15 minutes using Together AI's Llama models to provide instant market insights">
                <div className="text-right text-xs text-terminal-text/50">
                  <div className="flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    Auto Analysis
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Every 15 min</span>
                  </div>
                </div>
              </Tooltip>
              <Tooltip content="AI analysis settings and data sources">
                <button className="hover:text-terminal-accent transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          
          {/* AI Insights Summary Bar */}
          <div className="mb-6 bg-terminal-bg/40 rounded-lg border border-green-500/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Latest AI Market Insights
              </h3>
              <div className="text-xs text-terminal-text/60">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-500/10 rounded border border-green-500/20">
                <div className="text-green-400 font-semibold text-sm">Market Sentiment</div>
                <div className="text-2xl font-bold text-green-300">Bullish</div>
                <div className="text-xs text-terminal-text/60">76% confidence</div>
              </div>
              <div className="text-center p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <div className="text-blue-400 font-semibold text-sm">Risk Level</div>
                <div className="text-2xl font-bold text-blue-300">Moderate</div>
                <div className="text-xs text-terminal-text/60">Based on volatility</div>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                <div className="text-yellow-400 font-semibold text-sm">Key Trend</div>
                <div className="text-2xl font-bold text-yellow-300">Tech Focus</div>
                <div className="text-xs text-terminal-text/60">AI & semiconductors</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-terminal-bg/50 rounded-lg border border-terminal-border/30 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-terminal-text flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Market News Stream
                </h3>
                <Tooltip content="Real-time financial news from RSS feeds including Reuters, Bloomberg, and Financial Times">
                  <HelpCircle className="w-4 h-4 text-terminal-text/50 hover:text-terminal-accent cursor-help" />
                </Tooltip>
              </div>
              <NewsStream maxItems={15} />
            </div>
            <div className="bg-terminal-bg/50 rounded-lg border border-terminal-border/30 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-terminal-text flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-400" />
                  AI Market Analysis
                </h3>
                <Tooltip content="Advanced AI analysis using Together AI's Llama models for pattern recognition, sentiment analysis, and market predictions">
                  <HelpCircle className="w-4 h-4 text-terminal-text/50 hover:text-terminal-accent cursor-help" />
                </Tooltip>
              </div>
              <AIMarketAnalysis />
            </div>
          </div>
        </div>
      </div>{/* Enhanced Statistics and Additional Data */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-yellow-900/20 to-terminal-surface/40 border-2 border-yellow-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-terminal-text">Platform Statistics</h2>
                <p className="text-terminal-text/60 text-sm">Real-time platform metrics and additional market data</p>
              </div>
            </div>
          </div>          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Cryptocurrency Market */}
            <div className="bg-terminal-bg/50 rounded-lg border border-terminal-border/30 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-terminal-text flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  Cryptocurrency Market
                </h3>
                <Tooltip content="Live cryptocurrency prices and market data from major exchanges">
                  <HelpCircle className="w-4 h-4 text-terminal-text/50 hover:text-terminal-accent cursor-help" />
                </Tooltip>
              </div>
              
              {/* Crypto Heat Map */}
              <div className="mb-4 p-3 bg-terminal-surface/30 rounded border border-yellow-500/20">
                <div className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Top Cryptos (24h Change)
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-500/20 border border-green-500/30 rounded p-2 text-center">
                    <div className="text-green-400 font-semibold">BTC</div>
                    <div className="text-green-300">+3.24%</div>
                    <div className="text-terminal-text/60 text-xs">$67,420</div>
                  </div>
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded p-2 text-center">
                    <div className="text-blue-400 font-semibold">ETH</div>
                    <div className="text-blue-300">+2.87%</div>
                    <div className="text-terminal-text/60 text-xs">$3,845</div>
                  </div>
                  <div className="bg-red-500/20 border border-red-500/30 rounded p-2 text-center">
                    <div className="text-red-400 font-semibold">ADA</div>
                    <div className="text-red-300">-1.23%</div>
                    <div className="text-terminal-text/60 text-xs">$0.58</div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 rounded p-2 text-center">
                    <div className="text-green-400 font-semibold">SOL</div>
                    <div className="text-green-300">+5.67%</div>
                    <div className="text-terminal-text/60 text-xs">$189.34</div>
                  </div>
                </div>
              </div>
              
              <TradingViewTicker 
                symbols={['COINBASE:BTCUSD', 'COINBASE:ETHUSD', 'COINBASE:ADAUSD', 'COINBASE:SOLUSD']} 
                height={200}
              />
            </div>
            <div className="bg-terminal-bg/50 rounded-lg border border-terminal-border/30 p-4">
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="flex items-center gap-2">
                    <div className="terminal-dot red"></div>
                    <div className="terminal-dot yellow"></div>
                    <div className="terminal-dot green"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-terminal-accent font-semibold text-sm">
                      Platform Analytics
                    </span>
                  </div>
                </div>                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <MetricCard
                      title="Trading Tools"
                      value="15"
                      description="Professional-grade tools"
                      icon={<BarChart3 className="w-4 h-4" />}
                      sparklineData={[12, 13, 14, 15, 15, 14, 15]}
                      change={7.1}
                    />
                    <MetricCard
                      title="Market Coverage"
                      value="100+"
                      description="Global market symbols"
                      icon={<Globe className="w-4 h-4" />}
                      sparklineData={[95, 97, 98, 99, 100, 102, 105]}
                      change={12.5}
                    />
                    <MetricCard
                      title="Active Users"
                      value="2.5K"
                      description="Real-time traders"
                      icon={<Users className="w-4 h-4" />}
                      sparklineData={[2100, 2200, 2300, 2400, 2500, 2450, 2500]}
                      change={8.7}
                    />
                    <MetricCard
                      title="Uptime"
                      value="99.9%"
                      description="System reliability"
                      icon={<Activity className="w-4 h-4" />}
                      sparklineData={[99.8, 99.9, 99.9, 99.8, 99.9, 100, 99.9]}
                      change={0.1}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <ProgressRing 
                        progress={98.7} 
                        size={60} 
                        color="#00ff88" 
                        label="Cache"
                      />
                    </div>
                    <div className="text-center">
                      <ProgressRing 
                        progress={87.3} 
                        size={60} 
                        color="#ffaa00" 
                        label="Load"
                      />
                    </div>
                    <div className="text-center">
                      <ProgressRing 
                        progress={95.2} 
                        size={60} 
                        color="#00aaff" 
                        label="Speed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <Tooltip content="Current market sentiment based on AI analysis and technical indicators">
                      <MarketSentimentBadge 
                        sentiment="bullish" 
                        strength={76} 
                        size="lg"
                      />
                    </Tooltip>
                  </div>

                  <div className="pt-4 border-t border-terminal-border">                    <div className="text-center">
                      <p className="text-terminal-text/70 text-sm mb-2">
                        🤖 Powered by Together AI • 📊 Real-Time TradingView Data
                      </p>
                      <p className="text-terminal-accent text-xs">
                        Live market data with automated analysis every 15 minutes
                      </p>
                      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-terminal-text/50">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Real-time Data</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span>AI Analysis</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span>Mobile Optimized</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gradient-to-br from-terminal-bg/40 to-terminal-surface/30 border-2 border-terminal-border/50 rounded-lg p-6 hover:border-terminal-accent/30 hover:shadow-lg hover:shadow-terminal-accent/10 transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-terminal-accent/20 rounded-xl group-hover:bg-terminal-accent/30 transition-colors">
          <div className="text-terminal-accent text-xl">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-terminal-text group-hover:text-terminal-accent transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-terminal-text/70 text-sm leading-relaxed">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-terminal-text/50">
        <div className="w-2 h-2 bg-terminal-accent rounded-full"></div>
        <span>Active Feature</span>
      </div>
    </div>
  );
};

export default Dashboard;
