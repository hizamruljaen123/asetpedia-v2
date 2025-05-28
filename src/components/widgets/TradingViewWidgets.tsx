import React, { useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import marketDataService from '../../services/marketDataService';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  title?: string;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = 'NASDAQ:AAPL',
  theme = 'dark',
  title = 'Live Chart'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';

      // Create the TradingView widget script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true, // Important for filling container
        symbol: symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: theme,
        style: '1',
        locale: 'en',
        toolbar_bg: theme === 'dark' ? '#1a1a1a' : '#f1f3f6', // Adjusted for theme
        enable_publishing: false,
        withdateranges: true,
        range: '3M',
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        calendar: false,
        hide_volume: false
      });

      containerRef.current.appendChild(script);
    }
  }, [symbol, theme]); // Removed height from dependencies

  return (
    <div className="terminal-window flex flex-col h-full"> {/* MODIFIED: Added flex flex-col h-full */}
      <div className="terminal-header"> {/* Header */}
        <div className="flex items-center gap-2">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <BarChart3 className="w-4 h-4 text-terminal-accent" />
          <span className="text-terminal-accent font-semibold text-sm">
            {title} - {symbol}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-terminal-text/50">
          <span>Powered by TradingView</span>
        </div>
      </div>
      
      {/* This container should fill the remaining vertical space */}
      <div 
        ref={containerRef}
        className="tradingview-widget-container flex-grow" // MODIFIED: Added flex-grow
      >
        {/* Initial loading state (will be replaced by TradingView widget) */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 text-terminal-accent animate-pulse mx-auto mb-2" />
            <p className="text-terminal-text/70">Loading chart...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarketDataWidgetProps {
  title?: string;
}

export const CryptoWidget: React.FC<MarketDataWidgetProps> = ({ 
  title = "Cryptocurrency" 
}) => {
  const [cryptoData, setCryptoData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const data = await marketDataService.getCryptoData(['bitcoin', 'ethereum', 'cardano']);
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <DollarSign className="w-4 h-4 text-terminal-accent" />
          <span className="text-terminal-accent font-semibold text-sm">
            {title}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="text-center py-4">
            <DollarSign className="w-6 h-6 text-terminal-accent animate-pulse mx-auto mb-2" />
            <p className="text-terminal-text/70">Loading crypto data...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cryptoData.map((crypto) => (
              <div key={crypto.symbol} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-terminal-accent">
                      {crypto.symbol}
                    </span>
                    <div className="flex items-center gap-1">
                      {crypto.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-terminal-accent" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-terminal-error rotate-180" />
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-terminal-text">
                      {formatPrice(crypto.price)}
                    </div>
                    <div className={`text-sm font-mono ${
                      crypto.change >= 0 ? 'text-terminal-accent' : 'text-terminal-error'
                    }`}>
                      {crypto.change >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface EconomicCalendarWidgetProps {
  title?: string;
}

export const EconomicCalendarWidget: React.FC<EconomicCalendarWidgetProps> = ({ 
  title = "Economic Calendar" 
}) => {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const data = await marketDataService.getEconomicCalendar();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching economic calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-terminal-error border-terminal-error';
      case 'medium': return 'text-terminal-warning border-terminal-warning';
      case 'low': return 'text-terminal-text border-terminal-border';
      default: return 'text-terminal-text border-terminal-border';
    }
  };

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-terminal-accent font-semibold text-sm">
            {title}
          </span>
        </div>
      </div>
      
      <div className="p-4 max-h-80 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-terminal-text/70">Loading economic events...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs border ${getImportanceColor(event.importance)}`}>
                      {event.currency}
                    </span>
                    <span className="text-xs text-terminal-text/70">
                      {event.time}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getImportanceColor(event.importance)}`}>
                    {event.importance.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-terminal-text font-semibold text-sm mb-2">
                  {event.event}
                </h4>
                <div className="flex items-center gap-4 text-xs text-terminal-text/70">
                  <span>Previous: {event.previous}</span>
                  <span>Forecast: {event.forecast}</span>
                  {event.actual && <span>Actual: {event.actual}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
