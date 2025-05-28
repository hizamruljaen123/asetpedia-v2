import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Globe, Building, Users, Zap } from 'lucide-react';

interface EconomicIndicator {
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  unit: string;
  frequency: string;
  nextRelease: string;
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
  country: string;
  description: string;
}

interface MarketImpact {
  indicator: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  magnitude: number; // 1-10
  affectedMarkets: string[];
}

const EconomicIndicators: React.FC = () => {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [marketImpacts, setMarketImpacts] = useState<MarketImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const countries = ['ALL', 'US', 'EU', 'UK', 'JP', 'CN', 'CA'];
  const categories = ['ALL', 'GROWTH', 'INFLATION', 'EMPLOYMENT', 'MONETARY', 'TRADE'];

  useEffect(() => {
    generateEconomicData();
    const interval = setInterval(generateEconomicData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [selectedCountry, selectedCategory]);

  const generateEconomicData = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Generate economic indicators
      const economicData: EconomicIndicator[] = [
        {
          name: 'GDP Growth Rate',
          value: 2.1 + (Math.random() - 0.5) * 2,
          previousValue: 2.3,
          change: (Math.random() - 0.5) * 0.8,
          changePercent: (Math.random() - 0.5) * 20,
          unit: '%',
          frequency: 'Quarterly',
          nextRelease: '2024-01-28',
          importance: 'HIGH',
          country: 'US',
          description: 'Measures the economic growth of the country'
        },
        {
          name: 'Unemployment Rate',
          value: 3.5 + Math.random() * 2,
          previousValue: 3.7,
          change: (Math.random() - 0.5) * 0.5,
          changePercent: (Math.random() - 0.5) * 15,
          unit: '%',
          frequency: 'Monthly',
          nextRelease: '2024-01-15',
          importance: 'HIGH',
          country: 'US',
          description: 'Percentage of labor force that is unemployed'
        },
        {
          name: 'CPI Inflation',
          value: 3.1 + (Math.random() - 0.5) * 2,
          previousValue: 3.2,
          change: (Math.random() - 0.5) * 0.4,
          changePercent: (Math.random() - 0.5) * 12,
          unit: '%',
          frequency: 'Monthly',
          nextRelease: '2024-01-12',
          importance: 'HIGH',
          country: 'US',
          description: 'Consumer Price Index year-over-year change'
        },
        {
          name: 'Federal Funds Rate',
          value: 5.25 + Math.random() * 0.5,
          previousValue: 5.5,
          change: (Math.random() - 0.5) * 0.5,
          changePercent: (Math.random() - 0.5) * 10,
          unit: '%',
          frequency: 'Meeting',
          nextRelease: '2024-01-31',
          importance: 'HIGH',
          country: 'US',
          description: 'Federal Reserve target interest rate'
        },
        {
          name: 'Non-Farm Payrolls',
          value: 150 + Math.random() * 100,
          previousValue: 199,
          change: (Math.random() - 0.5) * 100,
          changePercent: (Math.random() - 0.5) * 50,
          unit: 'K',
          frequency: 'Monthly',
          nextRelease: '2024-01-05',
          importance: 'HIGH',
          country: 'US',
          description: 'Monthly change in non-farm employment'
        },
        {
          name: 'Retail Sales',
          value: 0.3 + (Math.random() - 0.5) * 2,
          previousValue: 0.1,
          change: (Math.random() - 0.5) * 1,
          changePercent: (Math.random() - 0.5) * 100,
          unit: '%',
          frequency: 'Monthly',
          nextRelease: '2024-01-18',
          importance: 'MEDIUM',
          country: 'US',
          description: 'Monthly change in retail sales'
        },
        {
          name: 'PMI Manufacturing',
          value: 48 + Math.random() * 8,
          previousValue: 49.2,
          change: (Math.random() - 0.5) * 4,
          changePercent: (Math.random() - 0.5) * 8,
          unit: '',
          frequency: 'Monthly',
          nextRelease: '2024-01-02',
          importance: 'MEDIUM',
          country: 'US',
          description: 'Purchasing Managers Index for manufacturing'
        },
        {
          name: 'Trade Balance',
          value: -68.9 + (Math.random() - 0.5) * 20,
          previousValue: -64.3,
          change: (Math.random() - 0.5) * 15,
          changePercent: (Math.random() - 0.5) * 25,
          unit: 'B$',
          frequency: 'Monthly',
          nextRelease: '2024-01-09',
          importance: 'MEDIUM',
          country: 'US',
          description: 'Difference between exports and imports'
        }
      ];

      // Generate market impacts
      const impacts: MarketImpact[] = [
        {
          indicator: 'CPI Inflation',
          impact: Math.random() > 0.5 ? 'NEGATIVE' : 'POSITIVE',
          magnitude: Math.floor(Math.random() * 5) + 6,
          affectedMarkets: ['Bonds', 'USD', 'Gold', 'Stocks']
        },
        {
          indicator: 'Non-Farm Payrolls',
          impact: Math.random() > 0.5 ? 'POSITIVE' : 'NEGATIVE',
          magnitude: Math.floor(Math.random() * 4) + 7,
          affectedMarkets: ['USD', 'Stocks', 'Bonds']
        },
        {
          indicator: 'Federal Funds Rate',
          impact: Math.random() > 0.5 ? 'NEGATIVE' : 'POSITIVE',
          magnitude: Math.floor(Math.random() * 3) + 8,
          affectedMarkets: ['Bonds', 'USD', 'Real Estate', 'Stocks']
        }
      ];

      setIndicators(economicData);
      setMarketImpacts(impacts);
      setLoading(false);
    }, 1000);
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'HIGH': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'MEDIUM': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'LOW': return 'text-green-400 border-green-400/30 bg-green-400/10';
      default: return 'text-terminal-text/70';
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'POSITIVE': return 'text-green-400';
      case 'NEGATIVE': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const formatValue = (indicator: EconomicIndicator) => {
    if (indicator.unit === 'K') {
      return `${indicator.value.toFixed(0)}K`;
    }
    if (indicator.unit === 'B$') {
      return `$${indicator.value.toFixed(1)}B`;
    }
    if (indicator.unit === '%') {
      return `${indicator.value.toFixed(1)}%`;
    }
    return indicator.value.toFixed(1);
  };

  const formatChange = (indicator: EconomicIndicator) => {
    const sign = indicator.change >= 0 ? '+' : '';
    if (indicator.unit === 'K') {
      return `${sign}${indicator.change.toFixed(0)}K`;
    }
    if (indicator.unit === 'B$') {
      return `${sign}$${indicator.change.toFixed(1)}B`;
    }
    if (indicator.unit === '%') {
      return `${sign}${indicator.change.toFixed(1)}pp`;
    }
    return `${sign}${indicator.change.toFixed(1)}`;
  };

  const getIndicatorIcon = (name: string) => {
    if (name.includes('GDP') || name.includes('Growth')) return <TrendingUp className="w-5 h-5" />;
    if (name.includes('Employment') || name.includes('Payrolls')) return <Users className="w-5 h-5" />;
    if (name.includes('CPI') || name.includes('Inflation')) return <DollarSign className="w-5 h-5" />;
    if (name.includes('Rate') || name.includes('Fed')) return <Building className="w-5 h-5" />;
    if (name.includes('PMI') || name.includes('Manufacturing')) return <Activity className="w-5 h-5" />;
    if (name.includes('Trade') || name.includes('Balance')) return <Globe className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

  const filteredIndicators = indicators.filter(indicator => {
    const countryMatch = selectedCountry === 'ALL' || indicator.country === selectedCountry;
    // For simplicity, we'll assume all indicators match category filter
    return countryMatch;
  });

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
              Economic Indicators Dashboard
            </span>
          </div>
        </div>
        <div className="terminal-content">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Globe className="w-8 h-8 text-terminal-accent animate-pulse mx-auto mb-2" />
              <p className="text-terminal-text/70">Loading economic data...</p>
            </div>
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
          <span className="text-terminal-accent font-semibold text-sm">
            Economic Indicators Dashboard
          </span>
        </div>
      </div>

      <div className="terminal-content">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-terminal-text/70 mb-2">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-terminal-text/70 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Economic Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredIndicators.map((indicator, index) => (
            <div
              key={index}
              className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-terminal-accent">
                    {getIndicatorIcon(indicator.name)}
                  </div>
                  <div>
                    <h4 className="text-terminal-text font-semibold">{indicator.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-terminal-text/70">{indicator.country}</span>
                      <span className={`text-xs px-2 py-1 rounded border ${getImportanceColor(indicator.importance)}`}>
                        {indicator.importance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-terminal-text">
                  {formatValue(indicator)}
                </div>
                <div className={`flex items-center gap-1 ${getChangeColor(indicator.change)}`}>
                  {getChangeIcon(indicator.change)}
                  <span className="font-semibold">
                    {formatChange(indicator)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-terminal-text/70">
                  Previous: {formatValue({...indicator, value: indicator.previousValue})}
                </div>
                <div className={`text-sm font-mono ${getChangeColor(indicator.changePercent)}`}>
                  {indicator.changePercent >= 0 ? '+' : ''}{indicator.changePercent.toFixed(1)}%
                </div>
              </div>

              <div className="text-xs text-terminal-text/70 mb-2">
                <div className="flex justify-between">
                  <span>Frequency: {indicator.frequency}</span>
                  <span>Next: {indicator.nextRelease}</span>
                </div>
              </div>

              <p className="text-xs text-terminal-text/60">
                {indicator.description}
              </p>
            </div>
          ))}
        </div>

        {/* Market Impact Analysis */}
        <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
          <h3 className="text-terminal-text font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-terminal-accent" />
            Market Impact Analysis
          </h3>
          <div className="space-y-3">
            {marketImpacts.map((impact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-terminal-bg/20 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div className={`font-semibold ${getImpactColor(impact.impact)}`}>
                    {impact.indicator}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${getImpactColor(impact.impact)}`}>
                      {impact.impact}
                    </span>
                    <div className="flex">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full mx-0.5 ${
                            i < impact.magnitude ? 'bg-terminal-accent' : 'bg-terminal-bg/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {impact.affectedMarkets.map((market, marketIndex) => (
                    <span
                      key={marketIndex}
                      className="text-xs px-2 py-1 bg-terminal-accent/20 text-terminal-accent rounded"
                    >
                      {market}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={generateEconomicData}
            className="px-4 py-2 bg-terminal-accent text-terminal-bg rounded-md hover:bg-terminal-accent/80 transition-colors"
          >
            Refresh Economic Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default EconomicIndicators;
