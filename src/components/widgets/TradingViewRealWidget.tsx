import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
  autosize?: boolean;
  interval?: string;
  timezone?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  withdateranges?: boolean;
  range?: string;
  hide_side_toolbar?: boolean;
  allow_symbol_change?: boolean;
  save_image?: boolean;
  calendar?: boolean;
  hide_volume?: boolean;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewAdvancedChart: React.FC<TradingViewWidgetProps> = ({
  symbol = "NASDAQ:AAPL",
  theme = "dark",
  width = "100%",
  height = 500,
  interval = "D",
  timezone = "Etc/UTC",
  locale = "en",
  toolbar_bg = "#f1f3f6",
  enable_publishing = false,
  withdateranges = true,
  range = "3M",
  hide_side_toolbar = false,
  allow_symbol_change = true,
  save_image = false,
  calendar = false,
  hide_volume = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;    script.innerHTML = JSON.stringify({
      autosize: false,
      symbol,
      interval,
      timezone,
      theme,
      style: "1",
      locale,
      toolbar_bg,
      enable_publishing,
      withdateranges,
      range,
      hide_side_toolbar,
      allow_symbol_change,
      save_image,
      calendar,
      hide_volume,
      width: typeof width === 'string' ? width : `${width}px`,
      height: typeof height === 'string' ? height : `${height}px`,
      support_host: "https://www.tradingview.com"
    });

    const widgetContainer = containerRef.current;
    widgetContainer.innerHTML = '';
    widgetContainer.appendChild(script);

    return () => {
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, [symbol, theme, interval, range]);

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
            TradingView Chart - {symbol}
          </span>
        </div>
      </div>
      <div className="terminal-content p-0">
        <div
          ref={containerRef}
          className="tradingview-widget-container"
          style={{ 
            height: typeof height === 'number' ? `${height}px` : height,
            width: typeof width === 'number' ? `${width}px` : width
          }}
        />
      </div>
    </div>
  );
};

export const TradingViewMiniChart: React.FC<{
  symbol?: string;
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
}> = ({
  symbol = "NASDAQ:AAPL",
  theme = "dark",
  width = "100%",
  height = 300
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "12M",
      colorTheme: theme,
      trendLineColor: "rgba(41, 98, 255, 1)",
      underLineColor: "rgba(41, 98, 255, 0.3)",
      underLineBottomColor: "rgba(41, 98, 255, 0)",
      isTransparent: true,
      autosize: true,
      largeChartUrl: ""
    });

    const widgetContainer = containerRef.current;
    widgetContainer.innerHTML = '';
    widgetContainer.appendChild(script);

    return () => {
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container bg-terminal-bg/20 rounded-md overflow-hidden"
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width
      }}
    />
  );
};

export const TradingViewMarketOverview: React.FC<{
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
}> = ({
  theme = "dark",
  width = "100%",
  height = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "100%",
      height: "100%",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(240, 243, 250, 0)",
      scaleFontColor: "rgba(120, 123, 134, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      tabs: [
        {
          title: "Indices",
          symbols: [
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "US 100" },
            { s: "FOREXCOM:DJI", d: "Dow 30" },
            { s: "INDEX:NKY", d: "Nikkei 225" },
            { s: "INDEX:DEU40", d: "DAX Index" },
            { s: "FOREXCOM:UKXGBP", d: "UK 100" }
          ],
          originalTitle: "Indices"
        },
        {
          title: "Futures",
          symbols: [
            { s: "CME_MINI:ES1!", d: "S&P 500" },
            { s: "CME:6E1!", d: "Euro" },
            { s: "COMEX:GC1!", d: "Gold" },
            { s: "NYMEX:CL1!", d: "WTI Crude Oil" },
            { s: "NYMEX:NG1!", d: "Gas" },
            { s: "CBOT:ZC1!", d: "Corn" }
          ],
          originalTitle: "Futures"
        },
        {
          title: "Bonds",
          symbols: [
            { s: "CBOT:ZB1!", d: "T-Bond" },
            { s: "CBOT:UB1!", d: "Ultra T-Bond" },
            { s: "EUREX:FGBL1!", d: "Euro Bund" },
            { s: "EUREX:FBTP1!", d: "Euro BTP" },
            { s: "EUREX:FGBM1!", d: "Euro BOBL" }
          ],
          originalTitle: "Bonds"
        },
        {
          title: "Forex",
          symbols: [
            { s: "FX:EURUSD", d: "EUR to USD" },
            { s: "FX:GBPUSD", d: "GBP to USD" },
            { s: "FX:USDJPY", d: "USD to JPY" },
            { s: "FX:USDCHF", d: "USD to CHF" },
            { s: "FX:AUDUSD", d: "AUD to USD" },
            { s: "FX:USDCAD", d: "USD to CAD" }
          ],
          originalTitle: "Forex"
        }
      ]
    });

    const widgetContainer = containerRef.current;
    widgetContainer.innerHTML = '';
    widgetContainer.appendChild(script);

    return () => {
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, [theme]);

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
            Market Overview
          </span>
        </div>
      </div>
      <div className="terminal-content p-0">
        <div
          ref={containerRef}
          className="tradingview-widget-container"
          style={{ 
            height: typeof height === 'number' ? `${height}px` : height,
            width: typeof width === 'number' ? `${width}px` : width
          }}
        />
      </div>
    </div>
  );
};

export const TradingViewCryptoMarket: React.FC<{
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
}> = ({
  theme = "dark",
  width = "100%",
  height = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-mkt-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: theme,
      locale: "en",
      isTransparent: true
    });

    const widgetContainer = containerRef.current;
    widgetContainer.innerHTML = '';
    widgetContainer.appendChild(script);

    return () => {
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, [theme]);

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
            Cryptocurrency Market
          </span>
        </div>
      </div>
      <div className="terminal-content p-0">
        <div
          ref={containerRef}
          className="tradingview-widget-container"
          style={{ 
            height: typeof height === 'number' ? `${height}px` : height,
            width: typeof width === 'number' ? `${width}px` : width
          }}
        />
      </div>
    </div>
  );
};

export const TradingViewTicker: React.FC<{
  symbols?: string[];
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
}> = ({
  symbols = [
    "NASDAQ:AAPL",
    "NASDAQ:MSFT", 
    "NASDAQ:GOOGL",
    "NASDAQ:AMZN",
    "NASDAQ:TSLA"
  ],
  theme = "dark",
  width = "100%",
  height = 80
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: symbols.map(symbol => ({ proName: symbol, title: symbol.split(':')[1] || symbol })),
      showSymbolLogo: true,
      colorTheme: theme,
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en"
    });

    const widgetContainer = containerRef.current;
    widgetContainer.innerHTML = '';
    widgetContainer.appendChild(script);

    return () => {
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, [symbols, theme]);

  return (
    <div className="bg-terminal-bg/20 border border-terminal-border rounded-md overflow-hidden">
      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width
        }}
      />
    </div>
  );
};

export const TradingViewEconomicCalendar: React.FC<{
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
}> = ({
  theme = "dark",
  width = "100%",
  height = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      isTransparent: true,
      width: "100%",
      height: "100%",
      locale: "en",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,jp,gb,ch,au,ca,nz,cn"
    });

    const widgetContainer = containerRef.current;
    widgetContainer.innerHTML = '';
    widgetContainer.appendChild(script);

    return () => {
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, [theme]);

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
            Economic Calendar
          </span>
        </div>
      </div>
      <div className="terminal-content p-0">
        <div
          ref={containerRef}
          className="tradingview-widget-container"
          style={{ 
            height: typeof height === 'number' ? `${height}px` : height,
            width: typeof width === 'number' ? `${width}px` : width
          }}
        />
      </div>
    </div>
  );
};
