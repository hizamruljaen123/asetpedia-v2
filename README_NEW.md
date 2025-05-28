# ASETPEDIA - Professional Trading Platform

A comprehensive, AI-powered financial market analysis platform built with React, TypeScript, and Vite. This platform provides professional-grade trading tools, real-time market data, and intelligent analysis for serious traders and investors.

## 🚀 Features Overview

### 🧠 AI-Powered Market Intelligence
- **Automated News Analysis**: Real-time RSS feed processing from multiple financial sources
- **Bilingual AI Analysis**: Intelligent market insights in English and Indonesian
- **Sentiment Tracking**: Market sentiment analysis and impact assessment
- **24/7 Automated Analysis**: Continuous market monitoring with scheduled updates

### 📊 Professional Trading Tools
- **Advanced Market Screener**: Filter and analyze 60+ stocks, ETFs, and cryptocurrencies
- **Portfolio Tracker**: Comprehensive portfolio management with real-time P&L calculations
- **Options Calculator**: Black-Scholes pricing with Greeks analysis
- **Risk Management Calculator**: Position sizing with Kelly Criterion and risk metrics
- **Trading Alerts & Watchlist**: Custom price alerts and symbol tracking
- **Earnings Calendar**: Comprehensive earnings tracking with estimates vs. actuals

### 📈 Real-Time Market Data
- **TradingView Integration**: Professional charts and market overview widgets
- **Live Economic Calendar**: Real-time economic events and announcements
- **Cryptocurrency Markets**: Dedicated crypto market screener and analysis
- **Multi-Asset Coverage**: Stocks, ETFs, Forex, Commodities, and Cryptocurrencies
- **Real-Time Quotes**: Live pricing from Yahoo Finance and other financial APIs

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom terminal theme
- **Charts**: TradingView embedded widgets
- **Data Sources**: Yahoo Finance API, Financial Modeling Prep API
- **AI Integration**: Llama API for intelligent analysis
- **State Management**: React hooks and local storage
- **Build Tool**: Vite with HMR (Hot Module Replacement)

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx      # Main layout component
│   └── widgets/
│       ├── MarketScreener.tsx       # Advanced stock screener
│       ├── PortfolioTracker.tsx     # Portfolio management
│       ├── OptionsCalculator.tsx    # Options pricing calculator
│       ├── RiskManagement.tsx       # Risk analysis tools
│       ├── TradingAlerts.tsx        # Alerts and watchlist
│       ├── EarningsCalendar.tsx     # Earnings tracking
│       ├── NewsWidgets.tsx          # AI-powered news analysis
│       └── TradingViewRealWidget.tsx # TradingView integrations
├── services/
│   ├── realMarketDataService.ts     # Real market data fetching
│   ├── aiAnalysis.ts                # AI analysis service
│   ├── newsService.ts               # RSS feed processing
│   └── freeWidgetService.ts         # Market data APIs
├── assets/
│   └── rss_feeds.json              # RSS feed configurations
└── types/
    └── index.ts                     # TypeScript definitions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation & Setup

1. **Clone and install dependencies**:
```bash
cd c:\python_apps\asetpedia
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open in browser**:
Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📊 Platform Features

### 1. Market Overview Dashboard
- **Real-time TradingView widgets** for comprehensive market analysis
- **Live ticker tape** with customizable symbol selection
- **Advanced charting** with professional indicators
- **Economic calendar** integration
- **Cryptocurrency market overview**

### 2. Advanced Market Screener
- **60+ symbols coverage** including stocks, ETFs, and crypto
- **Real-time filtering** by price, volume, and percentage change
- **Top gainers/losers lists** with automatic updates
- **Search functionality** for quick symbol lookup
- **Export capabilities** for further analysis

### 3. Portfolio Management
- **Add/edit/remove positions** with real-time tracking
- **P&L calculations** with day change monitoring
- **Portfolio summary dashboard** with performance metrics
- **Local storage persistence** for data retention
- **Risk analysis** per position and portfolio-wide

### 4. Options Trading Calculator
- **Black-Scholes pricing model** implementation
- **Complete Greeks calculation** (Delta, Gamma, Theta, Vega, Rho)
- **Risk/reward analysis** with probability calculations
- **Multiple option strategies** support
- **Real-time parameter adjustment** with instant recalculation

### 5. Risk Management Tools
- **Position sizing calculator** using Kelly Criterion
- **Risk/reward ratio analysis** with recommendations
- **Portfolio risk aggregation** and monitoring
- **Drawdown estimation** and risk level assessment
- **Trade setup validation** with professional metrics

### 6. Trading Alerts & Watchlist
- **Custom price alerts** with multiple trigger types
- **Watchlist management** with real-time updates
- **Alert history tracking** and management
- **Local storage persistence** for settings
- **Visual notifications** for triggered alerts

### 7. Earnings Calendar
- **Comprehensive earnings tracking** with estimates vs. actuals
- **Importance ratings** based on market cap and sector
- **Pre/post market timing** indicators
- **Historical performance** after earnings announcements
- **Filterable by date, importance, and timing**

### 8. AI-Powered News Analysis
- **Multi-source RSS integration** from major financial outlets
- **Bilingual analysis** (English/Indonesian) capability
- **Sentiment analysis** with market impact assessment
- **Automated categorization** by topic and relevance
- **Real-time processing** with scheduled updates

## 🎨 Design Philosophy

### Terminal-Inspired Interface
- **Dark theme** optimized for extended trading sessions
- **Terminal-style windows** with authentic styling
- **High contrast colors** for improved readability
- **Professional typography** for data-heavy interfaces
- **Responsive design** for all screen sizes

### User Experience
- **Tabbed navigation** for organized workflow
- **Contextual tooltips** for feature explanation
- **Keyboard shortcuts** for power users
- **Fast loading times** with optimized performance
- **Intuitive layouts** following trading platform conventions

## 🔧 Configuration

### API Keys (Optional)
For enhanced functionality, you can configure API keys in the respective service files:

- **Financial Modeling Prep**: Enhanced fundamental data
- **Llama API**: AI-powered analysis capabilities
- **Additional data sources**: As needed for specific features

### RSS Feeds
Customize news sources by editing `src/assets/rss_feeds.json`:

```json
{
  "sources": [
    {
      "name": "Reuters Business",
      "url": "https://feeds.reuters.com/reuters/businessNews",
      "category": "business"
    }
  ]
}
```

## 📈 Performance Features

- **Real-time data updates** without page refreshes
- **Efficient API caching** to minimize rate limiting
- **Local storage optimization** for persistent user data
- **Component lazy loading** for faster initial load
- **Optimized bundle size** with tree shaking

## 🛡 Risk Disclaimers

⚠️ **Important**: This platform is for educational and informational purposes only. Always conduct your own research and consider consulting with financial advisors before making investment decisions.

- Market data may have delays
- AI analysis is supplementary to human judgment
- Options trading involves significant risk
- Past performance doesn't guarantee future results

## 🤝 Contributing

This is a professional trading platform designed for educational purposes. Contributions for bug fixes, feature enhancements, and documentation improvements are welcome.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- Real-time WebSocket connections for live data
- Advanced charting with custom indicators
- Social sentiment analysis integration
- Mobile app development
- Advanced backtesting capabilities
- Integration with real brokerage APIs

---

**Built with ❤️ for traders, by traders**

*Professional trading tools that don't compromise on quality or functionality.*
