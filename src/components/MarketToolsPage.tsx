import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Shield, 
  Target, 
  DollarSign,
  Globe,
  Calendar,
  LineChart,
  PieChart,
  Briefcase,
  AlertCircle,
  Bot,
  Layers
} from 'lucide-react';
import { TerminalHeader } from './layout/DashboardLayout';

// Import all widget components
import TechnicalAnalysis from './widgets/TechnicalAnalysis';
import MarketSentiment from './widgets/MarketSentiment';
import OptionsCalculator from './widgets/OptionsCalculator';
import RiskManagement from './widgets/RiskManagement';
import PortfolioTracker from './widgets/PortfolioTracker';
import MarketScreener from './widgets/MarketScreener';
import EarningsCalendar from './widgets/EarningsCalendar';
import EconomicIndicators from './widgets/EconomicIndicators';
import ForexTrading from './widgets/ForexTrading';
import DerivativesTrading from './widgets/DerivativesTrading';
import TradingAlerts from './widgets/TradingAlerts';
import InstitutionalFlow from './widgets/InstitutionalFlow';
import AlternativeData from './widgets/AlternativeData';

interface ToolCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  tools: Tool[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  category: string;
  aiPowered: boolean;
  tags: string[];
}

const MarketToolsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const tools: Tool[] = [
    {
      id: 'technical-analysis',
      name: 'Technical Analysis Suite',
      description: 'AI-powered technical indicators, pattern recognition, and chart analysis',
      icon: BarChart3,
      component: TechnicalAnalysis,
      category: 'analysis',
      aiPowered: true,
      tags: ['technical', 'indicators', 'patterns', 'charts']
    },
    {
      id: 'market-sentiment',
      name: 'Market Sentiment Analyzer',
      description: 'Real-time sentiment analysis using AI to gauge market mood and fear/greed index',
      icon: Brain,
      component: MarketSentiment,
      category: 'analysis',
      aiPowered: true,
      tags: ['sentiment', 'mood', 'fear', 'greed']
    },
    {
      id: 'options-calculator',
      name: 'Options Pricing Calculator',
      description: 'Advanced options pricing with Black-Scholes model and Greeks analysis',
      icon: Calculator,
      component: OptionsCalculator,
      category: 'trading',
      aiPowered: false,
      tags: ['options', 'pricing', 'greeks', 'calculator']
    },
    {
      id: 'risk-management',
      name: 'Risk Management Suite',
      description: 'AI-powered position sizing, risk assessment, and portfolio risk analysis',
      icon: Shield,
      component: RiskManagement,
      category: 'risk',
      aiPowered: true,
      tags: ['risk', 'position', 'sizing', 'management']
    },
    {
      id: 'portfolio-tracker',
      name: 'Portfolio Performance Tracker',
      description: 'Comprehensive portfolio analysis with AI-driven insights and recommendations',
      icon: PieChart,
      component: PortfolioTracker,
      category: 'portfolio',
      aiPowered: true,
      tags: ['portfolio', 'performance', 'tracking', 'analysis']
    },
    {
      id: 'market-screener',
      name: 'Smart Market Screener',
      description: 'AI-powered stock screener with custom filters and smart recommendations',
      icon: Target,
      component: MarketScreener,
      category: 'screening',
      aiPowered: true,
      tags: ['screener', 'stocks', 'filters', 'recommendations']
    },
    {
      id: 'earnings-calendar',
      name: 'Earnings Calendar & Analysis',
      description: 'Upcoming earnings with AI-powered impact predictions and analysis',
      icon: Calendar,
      component: EarningsCalendar,
      category: 'fundamental',
      aiPowered: true,
      tags: ['earnings', 'calendar', 'predictions', 'impact']
    },
    {
      id: 'economic-indicators',
      name: 'Economic Indicators Dashboard',
      description: 'Real-time economic data with AI analysis and market impact assessment',
      icon: TrendingUp,
      component: EconomicIndicators,
      category: 'fundamental',
      aiPowered: true,
      tags: ['economic', 'indicators', 'macro', 'analysis']
    },
    {
      id: 'forex-trading',
      name: 'Forex Trading Suite',
      description: 'Advanced forex analysis with AI-powered currency pair predictions',
      icon: DollarSign,
      component: ForexTrading,
      category: 'trading',
      aiPowered: true,
      tags: ['forex', 'currency', 'pairs', 'trading']
    },
    {
      id: 'derivatives-trading',
      name: 'Derivatives Trading Platform',
      description: 'Complex derivatives analysis with AI risk assessment and pricing models',
      icon: Layers,
      component: DerivativesTrading,
      category: 'trading',
      aiPowered: true,
      tags: ['derivatives', 'futures', 'swaps', 'pricing']
    },
    {
      id: 'trading-alerts',
      name: 'Intelligent Trading Alerts',
      description: 'AI-powered alert system for trading opportunities and risk notifications',
      icon: AlertCircle,
      component: TradingAlerts,
      category: 'alerts',
      aiPowered: true,
      tags: ['alerts', 'notifications', 'opportunities', 'signals']
    },
    {
      id: 'institutional-flow',
      name: 'Institutional Flow Tracker',
      description: 'Track institutional money flows with AI pattern recognition',
      icon: Briefcase,
      component: InstitutionalFlow,
      category: 'analysis',
      aiPowered: true,
      tags: ['institutional', 'flow', 'money', 'tracking']
    },
    {
      id: 'alternative-data',
      name: 'Alternative Data Analytics',
      description: 'AI analysis of satellite data, social media, and alternative datasets',
      icon: Globe,
      component: AlternativeData,
      category: 'analysis',
      aiPowered: true,
      tags: ['alternative', 'data', 'satellite', 'social']
    }
  ];

  const categories: ToolCategory[] = [
    {
      id: 'all',
      name: 'All Tools',
      icon: Layers,
      description: 'View all available market analysis tools',
      tools: tools
    },
    {
      id: 'analysis',
      name: 'Market Analysis',
      icon: BarChart3,
      description: 'Technical and fundamental analysis tools',
      tools: tools.filter(tool => tool.category === 'analysis')
    },
    {
      id: 'trading',
      name: 'Trading Tools',
      icon: TrendingUp,
      description: 'Advanced trading and execution tools',
      tools: tools.filter(tool => tool.category === 'trading')
    },
    {
      id: 'risk',
      name: 'Risk Management',
      icon: Shield,
      description: 'Portfolio and position risk management',
      tools: tools.filter(tool => tool.category === 'risk')
    },
    {
      id: 'portfolio',
      name: 'Portfolio Management',
      icon: PieChart,
      description: 'Portfolio tracking and optimization',
      tools: tools.filter(tool => tool.category === 'portfolio')
    },
    {
      id: 'fundamental',
      name: 'Fundamental Analysis',
      icon: LineChart,
      description: 'Economic and company fundamental analysis',
      tools: tools.filter(tool => tool.category === 'fundamental')
    },
    {
      id: 'screening',
      name: 'Stock Screening',
      icon: Target,
      description: 'Advanced stock and asset screening tools',
      tools: tools.filter(tool => tool.category === 'screening')
    },
    {
      id: 'alerts',
      name: 'Alerts & Signals',
      icon: AlertCircle,
      description: 'Intelligent alerts and trading signals',
      tools: tools.filter(tool => tool.category === 'alerts')
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const aiPoweredCount = tools.filter(tool => tool.aiPowered).length;

  if (activeTool) {
    const selectedTool = tools.find(tool => tool.id === activeTool);
    if (selectedTool) {
      const ToolComponent = selectedTool.component;
      return (
        <div className="min-h-screen bg-terminal-bg">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-2 text-terminal-accent hover:text-terminal-accent/80 transition-colors mb-4"
              >
                ← Back to Tools
              </button>
              <TerminalHeader 
                title={selectedTool.name}
                subtitle={selectedTool.aiPowered ? "AI-Powered" : "Standard Tool"}
              />
            </div>
            <ToolComponent />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <TerminalHeader 
            title="AI-Powered Market Analysis Tools"
            subtitle={`${tools.length} Professional Tools | ${aiPoweredCount} AI-Enhanced`}
          />
          
          <div className="mt-6 bg-terminal-surface/50 backdrop-blur-md border border-terminal-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-terminal-accent" />
              <h2 className="text-xl font-bold text-terminal-accent">
                Professional Trading Suite
              </h2>
            </div>
            <p className="text-terminal-text/70 mb-4">
              Comprehensive collection of AI-powered market analysis tools designed for professional traders, 
              portfolio managers, and investment analysts. Each tool leverages advanced machine learning 
              algorithms to provide real-time insights and intelligent recommendations.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-terminal-accent/20 text-terminal-accent text-sm rounded-full border border-terminal-accent/30">
                Real-time Data
              </span>
              <span className="px-3 py-1 bg-terminal-accent/20 text-terminal-accent text-sm rounded-full border border-terminal-accent/30">
                AI-Powered Analysis
              </span>
              <span className="px-3 py-1 bg-terminal-accent/20 text-terminal-accent text-sm rounded-full border border-terminal-accent/30">
                Risk Management
              </span>
              <span className="px-3 py-1 bg-terminal-accent/20 text-terminal-accent text-sm rounded-full border border-terminal-accent/30">
                Portfolio Optimization
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search tools by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-terminal-surface/50 border border-terminal-border rounded-lg text-terminal-text placeholder:text-terminal-text/50 focus:outline-none focus:border-terminal-accent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                      activeCategory === category.id
                        ? 'bg-terminal-accent text-terminal-bg'
                        : 'bg-terminal-surface/50 text-terminal-text/70 hover:text-terminal-accent hover:bg-terminal-accent/10'
                    }`}
                  >
                    <CategoryIcon className="w-4 h-4" />
                    {category.name}
                    <span className="text-xs opacity-70">
                      ({category.tools.length})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="bg-terminal-surface/50 backdrop-blur-md border border-terminal-border rounded-lg p-6 hover:border-terminal-accent/50 hover:bg-terminal-accent/5 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-terminal-accent/20 rounded-lg flex items-center justify-center group-hover:bg-terminal-accent/30 transition-colors">
                      <ToolIcon className="w-6 h-6 text-terminal-accent" />
                    </div>
                    {tool.aiPowered && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-terminal-accent/20 rounded-full border border-terminal-accent/30">
                        <Bot className="w-3 h-3 text-terminal-accent" />
                        <span className="text-xs text-terminal-accent font-medium">AI</span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-terminal-accent mb-2 group-hover:text-terminal-accent/90">
                  {tool.name}
                </h3>
                
                <p className="text-terminal-text/70 text-sm mb-4 line-clamp-3">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {tool.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-terminal-border/30 text-terminal-text/60 text-xs rounded border border-terminal-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {tool.tags.length > 3 && (
                    <span className="px-2 py-1 text-terminal-text/50 text-xs">
                      +{tool.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-terminal-border/30">
                  <button className="w-full py-2 text-terminal-accent hover:text-terminal-accent/80 font-medium text-sm transition-colors">
                    Launch Tool →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-terminal-surface/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-terminal-text/50" />
            </div>
            <h3 className="text-lg font-semibold text-terminal-text/70 mb-2">
              No tools found
            </h3>
            <p className="text-terminal-text/50">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketToolsPage;
