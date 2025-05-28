import React, { useState, useEffect } from 'react';
import { Satellite, Smartphone, Globe, TrendingUp, TrendingDown, Activity, Map, Zap, Users, ShoppingCart, Truck, Factory, Wifi } from 'lucide-react';

interface SatelliteData {
  company: string;
  symbol: string;
  metric: string;
  value: number;
  change: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  source: string;
}

interface SocialSentiment {
  platform: string;
  mentions: number;
  sentiment: number;
  influencerScore: number;
  trendingTopics: string[];
  viralPosts: number;
  engagementRate: number;
}

interface SupplyChainMetric {
  company: string;
  symbol: string;
  metric: string;
  currentValue: number;
  historicalAvg: number;
  deviation: number;
  impact: 'positive' | 'negative' | 'neutral';
  region: string;
}

interface ESGScore {
  company: string;
  symbol: string;
  environmental: number;
  social: number;
  governance: number;
  overall: number;
  trend: number;
  controversy: boolean;
  carbonFootprint: number;
}

interface ConsumerBehavior {
  category: string;
  trend: string;
  growth: number;
  regions: string[];
  confidence: number;
  predictedImpact: string;
}

const AlternativeData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'satellite' | 'social' | 'supply' | 'esg' | 'consumer' | 'geolocation'>('satellite');
  const [selectedSector, setSelectedSector] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock data generators
  const generateSatelliteData = (): SatelliteData[] => {
    const companies = [
      { company: 'Walmart', symbol: 'WMT', metrics: ['Parking Lot Traffic', 'Store Expansion', 'Distribution Activity'] },
      { company: 'Tesla', symbol: 'TSLA', metrics: ['Factory Activity', 'Supercharger Network', 'Production Lines'] },
      { company: 'Target', symbol: 'TGT', metrics: ['Store Traffic', 'Inventory Levels', 'Seasonal Activity'] },
      { company: 'Amazon', symbol: 'AMZN', metrics: ['Warehouse Activity', 'Delivery Network', 'Data Center Growth'] },
      { company: 'Apple', symbol: 'AAPL', metrics: ['Store Traffic', 'Supply Chain', 'Factory Production'] }
    ];

    const data: SatelliteData[] = [];
    companies.forEach(company => {
      company.metrics.forEach(metric => {
        data.push({
          company: company.company,
          symbol: company.symbol,
          metric,
          value: 75 + Math.random() * 50,
          change: (Math.random() - 0.5) * 20,
          trend: Math.random() > 0.6 ? 'increasing' : Math.random() > 0.3 ? 'decreasing' : 'stable',
          confidence: 0.7 + Math.random() * 0.3,
          source: 'Planet Labs'
        });
      });
    });

    return data;
  };

  const generateSocialSentiment = (): SocialSentiment[] => {
    const platforms = [
      { platform: 'Twitter/X', weight: 0.35 },
      { platform: 'Reddit', weight: 0.25 },
      { platform: 'LinkedIn', weight: 0.15 },
      { platform: 'TikTok', weight: 0.15 },
      { platform: 'YouTube', weight: 0.10 }
    ];

    return platforms.map(platform => ({
      platform: platform.platform,
      mentions: Math.floor(Math.random() * 50000) + 10000,
      sentiment: -100 + Math.random() * 200,
      influencerScore: Math.random() * 100,
      trendingTopics: ['#AI', '#Tech', '#Trading', '#Markets', '#Stocks'].slice(0, Math.floor(Math.random() * 3) + 2),
      viralPosts: Math.floor(Math.random() * 20) + 5,
      engagementRate: 2 + Math.random() * 8
    }));
  };

  const generateSupplyChainMetrics = (): SupplyChainMetric[] => {
    const companies = ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'WMT', 'UPS', 'FDX'];
    const metrics = ['Port Activity', 'Shipping Delays', 'Inventory Turnover', 'Supplier Reliability', 'Logistics Efficiency'];
    const regions = ['Asia-Pacific', 'North America', 'Europe', 'Latin America'];

    return companies.map(symbol => ({
      company: symbol,
      symbol,
      metric: metrics[Math.floor(Math.random() * metrics.length)],
      currentValue: 50 + Math.random() * 50,
      historicalAvg: 60 + Math.random() * 30,
      deviation: (Math.random() - 0.5) * 30,
      impact: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'negative' : 'neutral',
      region: regions[Math.floor(Math.random() * regions.length)]
    }));
  };

  const generateESGScores = (): ESGScore[] => {
    const companies = [
      { company: 'Apple Inc.', symbol: 'AAPL' },
      { company: 'Microsoft', symbol: 'MSFT' },
      { company: 'Alphabet', symbol: 'GOOGL' },
      { company: 'Tesla', symbol: 'TSLA' },
      { company: 'Amazon', symbol: 'AMZN' },
      { company: 'Meta', symbol: 'META' },
      { company: 'Netflix', symbol: 'NFLX' }
    ];

    return companies.map(company => ({
      company: company.company,
      symbol: company.symbol,
      environmental: 60 + Math.random() * 40,
      social: 50 + Math.random() * 50,
      governance: 70 + Math.random() * 30,
      overall: 60 + Math.random() * 35,
      trend: (Math.random() - 0.5) * 10,
      controversy: Math.random() < 0.3,
      carbonFootprint: 100 + Math.random() * 500
    }));
  };

  const generateConsumerBehavior = (): ConsumerBehavior[] => {
    return [
      {
        category: 'E-commerce Growth',
        trend: 'Accelerating',
        growth: 15.2,
        regions: ['North America', 'Europe'],
        confidence: 0.89,
        predictedImpact: 'Strong positive for AMZN, SHOP'
      },
      {
        category: 'Sustainable Products',
        trend: 'Rising Demand',
        growth: 23.1,
        regions: ['Global'],
        confidence: 0.82,
        predictedImpact: 'Positive for ESG leaders'
      },
      {
        category: 'Digital Payments',
        trend: 'Mainstream Adoption',
        growth: 18.7,
        regions: ['Asia-Pacific', 'Latin America'],
        confidence: 0.91,
        predictedImpact: 'Bullish for PYPL, SQ, V'
      },
      {
        category: 'Remote Work Tools',
        trend: 'Stabilizing',
        growth: 3.2,
        regions: ['North America', 'Europe'],
        confidence: 0.75,
        predictedImpact: 'Neutral for ZM, TEAM'
      },
      {
        category: 'Electric Vehicles',
        trend: 'Strong Growth',
        growth: 45.8,
        regions: ['China', 'Europe', 'US'],
        confidence: 0.88,
        predictedImpact: 'Very bullish for TSLA, NIO'
      }
    ];
  };

  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);
  const [socialSentiment, setSocialSentiment] = useState<SocialSentiment[]>([]);
  const [supplyChainMetrics, setSupplyChainMetrics] = useState<SupplyChainMetric[]>([]);
  const [esgScores, setEsgScores] = useState<ESGScore[]>([]);
  const [consumerBehavior, setConsumerBehavior] = useState<ConsumerBehavior[]>([]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 20000);
    return () => clearInterval(interval);
  }, [selectedSector]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setSatelliteData(generateSatelliteData());
      setSocialSentiment(generateSocialSentiment());
      setSupplyChainMetrics(generateSupplyChainMetrics());
      setEsgScores(generateESGScores());
      setConsumerBehavior(generateConsumerBehavior());
      setLoading(false);
    }, 1500);
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSentimentColor = (sentiment: number): string => {
    if (sentiment > 20) return 'text-green-400';
    if (sentiment < -20) return 'text-red-400';
    return 'text-yellow-400';
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
              Alternative Data Analytics
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-terminal-text mb-2 flex items-center gap-2">
                <Satellite className="w-6 h-6 text-terminal-accent" />
                Alternative Data Intelligence
              </h2>
              <p className="text-terminal-text/70">
                Satellite imagery, social sentiment, supply chain, ESG metrics, and consumer behavior analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text"
              >
                <option value="all">All Sectors</option>
                <option value="tech">Technology</option>
                <option value="retail">Retail</option>
                <option value="energy">Energy</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
              </select>
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-terminal-accent text-terminal-bg rounded-md hover:bg-terminal-accent/80 disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                Analyze
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3">
        <TabButton 
          id="satellite" 
          icon={<Satellite className="w-4 h-4" />} 
          label="Satellite Data" 
        />
        <TabButton 
          id="social" 
          icon={<Smartphone className="w-4 h-4" />} 
          label="Social Sentiment" 
        />
        <TabButton 
          id="supply" 
          icon={<Truck className="w-4 h-4" />} 
          label="Supply Chain" 
        />
        <TabButton 
          id="esg" 
          icon={<Globe className="w-4 h-4" />} 
          label="ESG Analytics" 
        />
        <TabButton 
          id="consumer" 
          icon={<ShoppingCart className="w-4 h-4" />} 
          label="Consumer Trends" 
        />
        <TabButton 
          id="geolocation" 
          icon={<Map className="w-4 h-4" />} 
          label="Location Intelligence" 
        />
      </div>

      {/* Satellite Data Tab */}
      {activeTab === 'satellite' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Satellite Intelligence Dashboard
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left py-3 text-terminal-text/70">Company</th>
                    <th className="text-left py-3 text-terminal-text/70">Metric</th>
                    <th className="text-right py-3 text-terminal-text/70">Value</th>
                    <th className="text-right py-3 text-terminal-text/70">Change</th>
                    <th className="text-center py-3 text-terminal-text/70">Trend</th>
                    <th className="text-right py-3 text-terminal-text/70">Confidence</th>
                    <th className="text-left py-3 text-terminal-text/70">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {satelliteData.map((data, index) => (
                    <tr key={index} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                      <td className="py-3">
                        <div>
                          <div className="font-semibold text-terminal-text">{data.company}</div>
                          <div className="text-xs text-terminal-text/50">{data.symbol}</div>
                        </div>
                      </td>
                      <td className="py-3 text-terminal-text">{data.metric}</td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        {data.value.toFixed(1)}
                      </td>
                      <td className="text-right py-3">
                        <span className={`font-mono ${
                          data.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {data.change >= 0 ? '+' : ''}{data.change.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-center py-3">
                        {getTrendIcon(data.trend)}
                      </td>
                      <td className="text-right py-3">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-terminal-text font-mono text-xs">
                            {(data.confidence * 100).toFixed(0)}%
                          </span>
                          <div className="w-8 bg-terminal-border rounded-full h-2">
                            <div 
                              className="bg-terminal-accent h-2 rounded-full"
                              style={{ width: `${data.confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-terminal-text/70 text-xs">{data.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Social Sentiment Tab */}
      {activeTab === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Sentiment */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">Social Media Sentiment</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {socialSentiment.map((platform, index) => (
                  <div key={index} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-terminal-accent" />
                        <span className="font-semibold text-terminal-text">{platform.platform}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-terminal-text/70" />
                        <span className="text-xs text-terminal-text/70">{platform.mentions.toLocaleString()} mentions</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-terminal-text/70 mb-1">Sentiment Score</div>
                        <div className={`text-lg font-bold ${getSentimentColor(platform.sentiment)}`}>
                          {platform.sentiment.toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-terminal-text/70 mb-1">Influencer Score</div>
                        <div className="text-lg font-bold text-terminal-text">
                          {platform.influencerScore.toFixed(0)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-terminal-text/70 mb-2">Trending Topics</div>
                      <div className="flex flex-wrap gap-1">
                        {platform.trendingTopics.map((topic, i) => (
                          <span key={i} className="px-2 py-1 bg-terminal-accent/20 text-terminal-accent rounded text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">Engagement Analytics</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-terminal-text">+67.2%</div>
                    <div className="text-sm text-terminal-text/70">Overall Sentiment</div>
                  </div>
                  <div className="w-full bg-terminal-border rounded-full h-3">
                    <div className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-3 rounded-full relative">
                      <div className="absolute right-1/3 top-0 w-2 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-terminal-text/70 mt-1">
                    <span>Bearish</span>
                    <span>Neutral</span>
                    <span>Bullish</span>
                  </div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <h4 className="font-semibold text-terminal-text mb-3">Top Market Discussions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">AI Revolution</span>
                      <span className="text-green-400 text-xs">+89.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Fed Policy</span>
                      <span className="text-red-400 text-xs">-23.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">EV Adoption</span>
                      <span className="text-green-400 text-xs">+45.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Crypto Regulation</span>
                      <span className="text-yellow-400 text-xs">+12.4%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <h4 className="font-semibold text-terminal-text mb-3">Viral Content Impact</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-terminal-text mb-1">Posts going viral today</div>
                      <div className="text-2xl font-bold text-terminal-accent">
                        {socialSentiment.reduce((sum, p) => sum + p.viralPosts, 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-terminal-text mb-1">Avg engagement rate</div>
                      <div className="text-2xl font-bold text-terminal-text">
                        {(socialSentiment.reduce((sum, p) => sum + p.engagementRate, 0) / socialSentiment.length).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supply Chain Tab */}
      {activeTab === 'supply' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Global Supply Chain Intelligence
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left py-3 text-terminal-text/70">Company</th>
                    <th className="text-left py-3 text-terminal-text/70">Metric</th>
                    <th className="text-right py-3 text-terminal-text/70">Current</th>
                    <th className="text-right py-3 text-terminal-text/70">Historical Avg</th>
                    <th className="text-right py-3 text-terminal-text/70">Deviation</th>
                    <th className="text-center py-3 text-terminal-text/70">Impact</th>
                    <th className="text-left py-3 text-terminal-text/70">Region</th>
                  </tr>
                </thead>
                <tbody>
                  {supplyChainMetrics.map((metric, index) => (
                    <tr key={index} className="border-b border-terminal-border/50 hover:bg-terminal-bg/30">
                      <td className="py-3">
                        <span className="font-semibold text-terminal-text">{metric.symbol}</span>
                      </td>
                      <td className="py-3 text-terminal-text">{metric.metric}</td>
                      <td className="text-right py-3 text-terminal-text font-mono">
                        {metric.currentValue.toFixed(1)}
                      </td>
                      <td className="text-right py-3 text-terminal-text/70 font-mono">
                        {metric.historicalAvg.toFixed(1)}
                      </td>
                      <td className="text-right py-3">
                        <span className={`font-mono ${
                          metric.deviation >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {metric.deviation >= 0 ? '+' : ''}{metric.deviation.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-center py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          metric.impact === 'positive' ? 'bg-green-500/20 text-green-400' :
                          metric.impact === 'negative' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {metric.impact === 'positive' ? <TrendingUp className="w-3 h-3" /> :
                           metric.impact === 'negative' ? <TrendingDown className="w-3 h-3" /> :
                           <Activity className="w-3 h-3" />}
                          {metric.impact.toUpperCase()}
                        </div>
                      </td>
                      <td className="py-3 text-terminal-text/70">{metric.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ESG Analytics Tab */}
      {activeTab === 'esg' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">ESG Scores</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {esgScores.map((score, index) => (
                  <div key={index} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-terminal-text">{score.company}</div>
                        <div className="text-xs text-terminal-text/50">{score.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-terminal-text">{score.overall.toFixed(0)}</div>
                        <div className={`text-xs ${score.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {score.trend >= 0 ? '+' : ''}{score.trend.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-terminal-text/70">Environmental</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-terminal-border rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full"
                              style={{ width: `${score.environmental}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-terminal-text font-mono w-8">{score.environmental.toFixed(0)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-terminal-text/70">Social</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-terminal-border rounded-full h-2">
                            <div 
                              className="bg-blue-400 h-2 rounded-full"
                              style={{ width: `${score.social}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-terminal-text font-mono w-8">{score.social.toFixed(0)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-terminal-text/70">Governance</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-terminal-border rounded-full h-2">
                            <div 
                              className="bg-purple-400 h-2 rounded-full"
                              style={{ width: `${score.governance}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-terminal-text font-mono w-8">{score.governance.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {score.controversy && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-red-400">
                        <Activity className="w-3 h-3" />
                        <span>Active ESG Controversy</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">ESG Market Impact</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <h4 className="font-semibold text-terminal-text mb-3">ESG Investment Flow</h4>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">$2.3T</div>
                    <div className="text-sm text-terminal-text/70">Global ESG AUM</div>
                    <div className="text-xs text-green-400 mt-1">+15.2% YoY</div>
                  </div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <h4 className="font-semibold text-terminal-text mb-3">Carbon Credit Prices</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-terminal-text text-sm">EU ETS</span>
                      <span className="text-terminal-text font-mono">€85.40</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-terminal-text text-sm">California Cap</span>
                      <span className="text-terminal-text font-mono">$28.15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-terminal-text text-sm">RGGI</span>
                      <span className="text-terminal-text font-mono">$13.45</span>
                    </div>
                  </div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <h4 className="font-semibold text-terminal-text mb-3">Regulatory Impact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-terminal-text">
                      • EU Taxonomy compliance deadlines approaching
                    </div>
                    <div className="text-terminal-text">
                      • SEC climate disclosure rules pending
                    </div>
                    <div className="text-terminal-text">
                      • TCFD reporting mandate expansion
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consumer Trends Tab */}
      {activeTab === 'consumer' && (
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-terminal-accent font-semibold">
                Consumer Behavior Intelligence
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consumerBehavior.map((trend, index) => (
                <div key={index} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-terminal-text">{trend.category}</h3>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-terminal-accent" />
                      <span className="text-xs text-terminal-text/70">
                        {(trend.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-terminal-text/70 mb-1">Trend Status</div>
                    <div className="text-lg font-semibold text-terminal-text">{trend.trend}</div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-terminal-text/70 mb-1">Growth Rate</div>
                    <div className="text-2xl font-bold text-green-400">+{trend.growth.toFixed(1)}%</div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-terminal-text/70 mb-2">Active Regions</div>
                    <div className="flex flex-wrap gap-1">
                      {trend.regions.map((region, i) => (
                        <span key={i} className="px-2 py-1 bg-terminal-accent/20 text-terminal-accent rounded text-xs">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-terminal-border">
                    <div className="text-sm text-terminal-text/70 mb-1">Market Impact</div>
                    <div className="text-sm text-terminal-text">{trend.predictedImpact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Geolocation Intelligence Tab */}
      {activeTab === 'geolocation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">Location Analytics</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Map className="w-4 h-4 text-terminal-accent" />
                    <h4 className="font-semibold text-terminal-text">Foot Traffic Analysis</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Apple Stores</span>
                      <span className="text-green-400 font-mono">+8.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Starbucks</span>
                      <span className="text-green-400 font-mono">+12.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Target Stores</span>
                      <span className="text-red-400 font-mono">-3.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Walmart</span>
                      <span className="text-green-400 font-mono">+5.2%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Factory className="w-4 h-4 text-terminal-accent" />
                    <h4 className="font-semibold text-terminal-text">Manufacturing Activity</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Tesla Gigafactory</span>
                      <span className="text-green-400 font-mono">High Activity</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Intel Fabs</span>
                      <span className="text-yellow-400 font-mono">Moderate</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Ford Plants</span>
                      <span className="text-red-400 font-mono">Reduced</span>
                    </div>
                  </div>
                </div>

                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Wifi className="w-4 h-4 text-terminal-accent" />
                    <h4 className="font-semibold text-terminal-text">Digital Footprint</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Mobile App Downloads</span>
                      <span className="text-green-400 font-mono">+23.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Website Traffic</span>
                      <span className="text-green-400 font-mono">+15.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-terminal-text text-sm">Search Interest</span>
                      <span className="text-yellow-400 font-mono">+7.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-terminal-accent font-semibold">Geographic Insights</span>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-terminal-bg/30 border border-terminal-border rounded-md h-64 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-terminal-accent mx-auto mb-4" />
                  <div className="text-terminal-text/70">
                    Interactive geolocation heatmap would be displayed here
                  </div>
                  <div className="text-sm text-terminal-text/50 mt-2">
                    Showing real-time location intelligence data
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="text-sm font-semibold text-terminal-text">Key Metrics:</div>
                <div className="text-xs text-terminal-text/70">
                  • Population density changes
                </div>
                <div className="text-xs text-terminal-text/70">
                  • Commercial activity patterns
                </div>
                <div className="text-xs text-terminal-text/70">
                  • Transportation flow analysis
                </div>
                <div className="text-xs text-terminal-text/70">
                  • Economic activity correlation
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternativeData;
