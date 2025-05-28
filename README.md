# Asetpedia - AI-Powered Financial Market Analysis Platform

A modern financial market analysis platform built with React, TypeScript, and Vite, featuring AI-powered news analysis and real-time market data visualization.

## Features

### 🤖 AI-Powered Analysis
- **Llama API Integration**: Intelligent news analysis and summarization
- **Market Intelligence**: AI-generated market summaries and trading recommendations
- **Sentiment Analysis**: Real-time news sentiment tracking

### 📊 Market Data & Visualization
- **Real-time Market Data**: Integration with Yahoo Finance API
- **Interactive Charts**: Line, area, and pie charts using Recharts
- **Market Widgets**: Live ticker, market overview, and performance tracking
- **WebSocket Support**: Live data updates for real-time trading experience

### 📰 News Aggregation
- **RSS Feed Integration**: Multiple sources including Bloomberg, CNBC, TechCrunch, Reuters
- **Category Filtering**: Economics, Technology, Business, Politics
- **AI Summarization**: Automated news summarization with key insights
- **Automated Analysis**: Scheduled analysis every few hours

### 🎨 Modern UI/UX
- **Terminal-Style Interface**: Dark theme with modern trading platform aesthetics
- **Responsive Design**: Optimized for all screen sizes
- **Matrix Background Effects**: Animated terminal-style visual effects
- **Performance Optimized**: Fast loading times with efficient data handling

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom terminal theme
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Routing**: React Router DOM

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd asetpedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_LLAMA_API_KEY=your_llama_api_key_here
   VITE_YAHOO_FINANCE_API_KEY=your_yahoo_finance_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## API Configuration

### Llama API
The platform uses Llama API for AI-powered news analysis and market intelligence. Get your API key from [Llama API](https://api.llama.ai) and add it to your `.env` file.

### Yahoo Finance API
For real-time market data, we integrate with Yahoo Finance API. The application includes intelligent fallbacks with mock data for development and testing.

## Project Structure

```
src/
├── components/
│   ├── charts/          # Chart components (MarketCharts)
│   ├── layout/          # Layout components (DashboardLayout)
│   └── widgets/         # Widget components (MarketWidgets, NewsWidgets)
├── services/
│   ├── aiAnalysis.ts    # AI analysis service (Llama API)
│   ├── marketDataService.ts  # Market data service
│   └── newsService.ts   # News aggregation service
├── types/
│   └── index.ts         # TypeScript type definitions
├── Dashboard.tsx        # Main dashboard component
└── App.tsx             # Root application component
```

## Features in Detail

### AI Analysis Service
- **News Summarization**: Automatically summarizes news articles with key insights
- **Market Analysis**: Generates market intelligence reports
- **Trading Recommendations**: AI-powered trading suggestions
- **Sentiment Scoring**: Analyzes market sentiment from news

### Market Data Service
- **Real-time Quotes**: Live stock and forex prices
- **Historical Data**: Chart data for technical analysis
- **Market Overview**: Indices, commodities, and currency tracking
- **Performance Metrics**: Volume, change percentages, and trends

### News Service
- **Multi-source Aggregation**: Fetches from 8+ major news sources
- **RSS Feed Parsing**: Efficient news extraction and categorization
- **Real-time Updates**: Continuous news stream monitoring
- **Category Management**: Business, Technology, Economics, Politics

## Development Guidelines

- **TypeScript**: Full type safety with comprehensive interfaces
- **Modern React**: Hooks, context, and functional components
- **Performance**: Optimized rendering and efficient data fetching
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Responsive Design**: Mobile-first approach with terminal aesthetics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
