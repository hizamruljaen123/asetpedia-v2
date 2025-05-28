import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Clock, Star } from 'lucide-react';

interface EarningsEvent {
  symbol: string;
  company: string;
  date: string;
  time: 'BMO' | 'AMC' | 'DMT'; // Before Market Open, After Market Close, During Market Time
  estimatedEPS: number;
  actualEPS?: number;
  estimatedRevenue: number;
  actualRevenue?: number;
  importance: 'low' | 'medium' | 'high';
  sector: string;
  marketCap: number;
  previousClose: number;
  afterHoursPrice?: number;
  afterHoursChange?: number;
}

const EarningsCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [earningsData, setEarningsData] = useState<EarningsEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'BMO' | 'AMC' | 'DMT'>('all');

  // Mock earnings data - in a real app, this would come from an API
  useEffect(() => {
    const generateMockEarnings = (): EarningsEvent[] => {
      const companies = [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', cap: 2800000000000 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', cap: 2600000000000 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', cap: 1500000000000 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', cap: 1200000000000 },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', cap: 800000000000 },
        { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', cap: 700000000000 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', cap: 1100000000000 },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', cap: 400000000000 },
        { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', cap: 450000000000 },
        { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services', cap: 500000000000 },
        { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', cap: 350000000000 },
        { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', cap: 480000000000 },
        { symbol: 'HD', name: 'The Home Depot Inc.', sector: 'Consumer Discretionary', cap: 320000000000 },
        { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services', cap: 380000000000 },
        { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services', cap: 180000000000 }
      ];      const times: EarningsEvent['time'][] = ['BMO', 'AMC', 'DMT'];
      
      return companies.map((company, index) => {
        const baseDate = new Date(selectedDate);
        const dayOffset = Math.floor(index / 3) - 2; // Spread across 5 days
        const eventDate = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
        
        // Determine importance based on market cap
        let importance: EarningsEvent['importance'];
        if (company.cap > 1000000000000) importance = 'high';
        else if (company.cap > 300000000000) importance = 'medium';
        else importance = 'low';

        const estimatedEPS = Math.random() * 10 + 1;
        const estimatedRevenue = Math.random() * 50000000000 + 10000000000;
        const previousClose = Math.random() * 300 + 50;
        
        // Some companies have already reported (simulate past earnings)
        const hasReported = Math.random() > 0.7;
        let actualEPS, actualRevenue, afterHoursPrice, afterHoursChange;
        
        if (hasReported) {
          actualEPS = estimatedEPS * (0.8 + Math.random() * 0.4); // ±20% variance
          actualRevenue = estimatedRevenue * (0.9 + Math.random() * 0.2); // ±10% variance
          afterHoursChange = (Math.random() - 0.5) * 20; // ±10% change
          afterHoursPrice = previousClose * (1 + afterHoursChange / 100);
        }

        return {
          symbol: company.symbol,
          company: company.name,
          date: eventDate.toISOString().split('T')[0],
          time: times[index % times.length],
          estimatedEPS,
          actualEPS,
          estimatedRevenue,
          actualRevenue,
          importance,
          sector: company.sector,
          marketCap: company.cap,
          previousClose,
          afterHoursPrice,
          afterHoursChange
        };
      });
    };

    setEarningsData(generateMockEarnings());
  }, [selectedDate]);

  const filteredEarnings = earningsData.filter(earning => {
    const dateMatch = earning.date === selectedDate;
    const importanceMatch = filter === 'all' || earning.importance === filter;
    const timeMatch = timeFilter === 'all' || earning.time === timeFilter;
    return dateMatch && importanceMatch && timeMatch;
  });

  const getTimeLabel = (time: EarningsEvent['time']): string => {
    switch (time) {
      case 'BMO': return 'Before Market Open';
      case 'AMC': return 'After Market Close';
      case 'DMT': return 'During Market Time';
    }
  };

  const getImportanceColor = (importance: EarningsEvent['importance']): string => {
    switch (importance) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
    }
  };

  const getImportanceStars = (importance: EarningsEvent['importance']): React.ReactNode[] => {
    const count = importance === 'high' ? 3 : importance === 'medium' ? 2 : 1;
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < count ? getImportanceColor(importance) : 'text-gray-600'} ${
          i < count ? 'fill-current' : ''
        }`}
      />
    ));
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${value.toFixed(2)}`;
  };

  const formatMarketCap = (value: number): string => {
    if (value >= 1000000000000) return `$${(value / 1000000000000).toFixed(1)}T`;
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(0)}B`;
    return `$${(value / 1000000).toFixed(0)}M`;
  };

  const upcomingWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-terminal-accent font-semibold">
              Earnings Calendar
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Importance
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              >
                <option value="all">All</option>
                <option value="high">High Impact</option>
                <option value="medium">Medium Impact</option>
                <option value="low">Low Impact</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Timing
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
                className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              >
                <option value="all">All Times</option>
                <option value="BMO">Before Market Open</option>
                <option value="AMC">After Market Close</option>
                <option value="DMT">During Market Time</option>
              </select>
            </div>
          </div>

          {/* Quick Date Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {upcomingWeek.map((date) => {
              const dateObj = new Date(date);
              const isSelected = date === selectedDate;
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNumber = dateObj.getDate();
              
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-2 rounded-md border transition-colors ${
                    isSelected
                      ? 'bg-terminal-accent text-terminal-bg border-terminal-accent'
                      : 'border-terminal-border text-terminal-text hover:border-terminal-accent'
                  }`}
                >
                  <div className="text-xs">{dayName}</div>
                  <div className="text-sm font-medium">{dayNumber}</div>
                </button>
              );
            })}
          </div>

          {/* Earnings List */}
          <div className="space-y-3">
            {filteredEarnings.length === 0 ? (
              <div className="text-center py-8 text-terminal-text/50">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No earnings events found for the selected filters.</p>
              </div>
            ) : (
              filteredEarnings.map((earning) => (
                <div
                  key={`${earning.symbol}-${earning.date}`}
                  className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4 hover:bg-terminal-bg/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Company Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-accent font-bold text-lg">
                            {earning.symbol}
                          </span>
                          <div className="flex">
                            {getImportanceStars(earning.importance)}
                          </div>
                        </div>
                        <div className="text-terminal-text font-medium">
                          {earning.company}
                        </div>
                        <div className="text-sm text-terminal-text/70">
                          {earning.sector} • {formatMarketCap(earning.marketCap)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-terminal-text/70" />
                        <span className="text-sm text-terminal-text/70">
                          {getTimeLabel(earning.time)}
                        </span>
                      </div>
                    </div>

                    {/* Earnings Data */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      {/* EPS */}
                      <div className="text-center">
                        <div className="text-xs text-terminal-text/70 mb-1">EPS</div>
                        <div className="text-sm">
                          <div className="text-terminal-text">
                            Est: ${earning.estimatedEPS.toFixed(2)}
                          </div>
                          {earning.actualEPS && (
                            <div className={`font-medium ${
                              earning.actualEPS >= earning.estimatedEPS 
                                ? 'text-green-400' 
                                : 'text-red-400'
                            }`}>
                              Act: ${earning.actualEPS.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Revenue */}
                      <div className="text-center">
                        <div className="text-xs text-terminal-text/70 mb-1">Revenue</div>
                        <div className="text-sm">
                          <div className="text-terminal-text">
                            Est: {formatCurrency(earning.estimatedRevenue)}
                          </div>
                          {earning.actualRevenue && (
                            <div className={`font-medium ${
                              earning.actualRevenue >= earning.estimatedRevenue 
                                ? 'text-green-400' 
                                : 'text-red-400'
                            }`}>
                              Act: {formatCurrency(earning.actualRevenue)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stock Price */}
                      <div className="text-center">
                        <div className="text-xs text-terminal-text/70 mb-1">Stock Price</div>
                        <div className="text-sm">
                          <div className="text-terminal-text">
                            Close: ${earning.previousClose.toFixed(2)}
                          </div>
                          {earning.afterHoursPrice && earning.afterHoursChange && (
                            <div className={`font-medium flex items-center justify-center gap-1 ${
                              earning.afterHoursChange >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {earning.afterHoursChange >= 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              ${earning.afterHoursPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* After Hours Change */}
                      <div className="text-center">
                        <div className="text-xs text-terminal-text/70 mb-1">Change</div>
                        <div className="text-sm">
                          {earning.afterHoursChange ? (
                            <div className={`font-medium ${
                              earning.afterHoursChange >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {earning.afterHoursChange >= 0 ? '+' : ''}
                              {earning.afterHoursChange.toFixed(2)}%
                            </div>
                          ) : (
                            <div className="text-terminal-text/70 text-xs">
                              Pending
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCalendar;
