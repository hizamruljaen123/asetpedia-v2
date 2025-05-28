import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { Newspaper, Clock, Brain, RefreshCw, ExternalLink, Filter, Tag, BookOpen } from 'lucide-react';
import type { NewsItem, AIAnalysisResponse } from '../../types';
import newsService from '../../services/newsService';
import aiAnalysisService from '../../services/aiAnalysis';
import rssFeedData from '../../assets/rss_feeds.json';

interface RssFeedItemFromFile {
  name: string;
  url: string;
  category: string;
}

interface NewsStreamProps {
  category?: 'economics' | 'technology' | 'business' | 'politics';
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const NewsStream: React.FC<NewsStreamProps> = ({ 
  category, 
  maxItems = 20, 
  autoRefresh = true,
  refreshInterval = 300000 // 5 minutes
}) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);

  // Dynamically generate categories from rss_feeds.json
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    (rssFeedData as RssFeedItemFromFile[]).forEach(feed => {
      uniqueCategories.add(feed.category.toLowerCase());
    });
    
    const categoryMap: { [key: string]: string } = {
      'economy': '📈',
      'technology': '💻',
      'business': '💼',
      'politics': '🏛️',
      'news': '📰',
      'world': '🌍',
      'sports': '⚽',
      'multimedia': '🖼️',
      'health': '⚕️',
      'science': '🔬',
      'entertainment': '🎭',
      'general': '🌐',
      // Add more mappings as needed for new categories from rss_feeds.json
      // Default icon for categories not in map
    };

    const getIcon = (cat: string) => categoryMap[cat] || '📑'; // Default icon

    const sortedCategories = Array.from(uniqueCategories).sort();

    return [
      { value: undefined, label: 'All', icon: '🌐' },
      ...sortedCategories.map(cat => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalize first letter
        icon: getIcon(cat)
      }))
    ];
  }, []);


  const fetchNews = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const newsData = await newsService.fetchNews(selectedCategory, forceRefresh);
      setNews(newsData.slice(0, maxItems));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    if (autoRefresh) {
      const interval = setInterval(() => fetchNews(), refreshInterval);
      return () => clearInterval(interval);
    }  }, [selectedCategory, maxItems, autoRefresh, refreshInterval]);

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <Newspaper className="w-4 h-4 text-terminal-accent" />
          <span className="text-terminal-accent font-semibold text-sm">
            News Stream
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchNews(true)}
            className="text-terminal-text/70 hover:text-terminal-accent transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs text-terminal-text/50">
            {lastUpdate.toLocaleTimeString('id-ID')}
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b border-terminal-border p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-terminal-accent" />
          <span className="text-sm text-terminal-text/70 mr-2">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat.value || 'all'}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded-md text-xs transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/30'
                  : 'bg-terminal-bg/50 text-terminal-text/70 hover:text-terminal-accent hover:bg-terminal-accent/10'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 max-h-[600px] overflow-y-auto scrollbar-thin">
        {loading && news.length === 0 ? (
          <div className="text-center py-8">
            <RefreshCw className="w-6 h-6 text-terminal-accent animate-spin mx-auto mb-2" />
            <p className="text-terminal-text/70">Loading news...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (analysis || analyzing) return;
    
    setAnalyzing(true);
    try {
      const result = await aiAnalysisService.analyzeNews(news.content, news.category);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing news:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const lowerCategory = category.toLowerCase();
    switch (lowerCategory) {
      case 'ekonomi': return 'text-terminal-accent border-terminal-accent'; // Indonesian specific
      case 'economy': return 'text-terminal-accent border-terminal-accent';
      case 'teknologi': return 'text-blue-400 border-blue-400'; // Indonesian specific
      case 'technology': return 'text-blue-400 border-blue-400';
      case 'bisnis': return 'text-terminal-warning border-terminal-warning'; // Indonesian specific
      case 'business': return 'text-terminal-warning border-terminal-warning';
      case 'politik': return 'text-purple-400 border-purple-400'; // Indonesian specific
      case 'politics': return 'text-purple-400 border-purple-400';
      case 'investasi': return 'text-green-400 border-green-400'; // Indonesian specific
      case 'pergerakan pasar': return 'text-yellow-400 border-yellow-400'; // Indonesian specific
      case 'news': return 'text-sky-400 border-sky-400';
      case 'world': return 'text-orange-400 border-orange-400';
      case 'sports': return 'text-lime-400 border-lime-400';
      case 'multimedia': return 'text-fuchsia-400 border-fuchsia-400';
      case 'health': return 'text-red-400 border-red-400';
      case 'science': return 'text-indigo-400 border-indigo-400';
      case 'entertainment': return 'text-pink-400 border-pink-400';
      case 'general': return 'text-gray-400 border-gray-400';
      default: 
        // Fallback for any other categories to ensure they have a color
        const colors = [
          'text-red-400 border-red-400', 'text-orange-400 border-orange-400', 
          'text-amber-400 border-amber-400', 'text-yellow-400 border-yellow-400', 
          'text-lime-400 border-lime-400', 'text-green-400 border-green-400', 
          'text-emerald-400 border-emerald-400', 'text-teal-400 border-teal-400', 
          'text-cyan-400 border-cyan-400', 'text-sky-400 border-sky-400', 
          'text-blue-400 border-blue-400', 'text-indigo-400 border-indigo-400', 
          'text-violet-400 border-violet-400', 'text-purple-400 border-purple-400', 
          'text-fuchsia-400 border-fuchsia-400', 'text-pink-400 border-pink-400', 
          'text-rose-400 border-rose-400'
        ];
        // Simple hash function to pick a color based on category name
        let hash = 0;
        for (let i = 0; i < lowerCategory.length; i++) {
          hash = lowerCategory.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length] || 'text-terminal-text border-terminal-border';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedAt = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishedAt.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4 hover:bg-terminal-bg/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-1 rounded text-xs border ${getCategoryColor(news.category)}`}>
            {news.category.toUpperCase()}
          </span>
          <span className="text-xs text-terminal-text/70">
            {news.source}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-terminal-text/50">
          <Clock className="w-3 h-3" />
          {formatTimeAgo(news.publishedAt)}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-terminal-text font-semibold mb-2 line-clamp-2 hover:text-terminal-accent transition-colors">
        {news.title}
      </h3>

      {/* Description */}
      <p className="text-terminal-text/70 text-sm mb-3 line-clamp-3">
        {news.description}
      </p>      {/* AI Analysis Section */}
      {analysis && (
        <div className="bg-terminal-accent/10 border border-terminal-accent/30 rounded-md p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-terminal-accent" />
            <span className="text-xs font-semibold text-terminal-accent">AI Analysis</span>
          </div>
          
          {/* Summary */}
          <p className="text-sm text-terminal-text/90 mb-3">
            {analysis.summary}
          </p>

          {/* Key Points */}
          {analysis.keyPoints && analysis.keyPoints.length > 0 && (
            <div className="mb-3">
              <span className="text-xs font-semibold text-terminal-accent mb-1 block">Key Points:</span>
              <ul className="text-xs text-terminal-text/80 space-y-1">
                {analysis.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-terminal-accent mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keywords */}
          {analysis.keywords && analysis.keywords.length > 0 && (
            <div className="mb-3">
              <span className="text-xs font-semibold text-terminal-accent mb-2 block">Keywords:</span>
              <div className="flex flex-wrap gap-1">
                {analysis.keywords.map((keyword, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-terminal-bg/50 border border-terminal-border rounded text-xs text-terminal-text/80">
                    <Tag className="w-3 h-3" />
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {analysis.references && analysis.references.length > 0 && (
            <div className="mb-3">
              <span className="text-xs font-semibold text-terminal-accent mb-2 block">Research References:</span>
              <div className="flex flex-wrap gap-1">
                {analysis.references.map((reference, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-terminal-accent/20 border border-terminal-accent/30 rounded text-xs text-terminal-accent">
                    <BookOpen className="w-3 h-3" />
                    {reference}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Market Impact & Sentiment */}
          <div className="flex items-center justify-between pt-2 border-t border-terminal-border">
            <div className="flex items-center gap-2">
              <span className="text-xs text-terminal-text/70">Sentiment:</span>
              <span className={`text-xs font-semibold ${
                analysis.sentiment === 'positive' ? 'text-terminal-accent' :
                analysis.sentiment === 'negative' ? 'text-terminal-error' : 
                'text-terminal-warning'
              }`}>
                {analysis.sentiment?.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-terminal-text/70">Market Impact:</span>
              <span className={`text-xs font-semibold ${
                analysis.marketImpact === 'high' ? 'text-terminal-error' :
                analysis.marketImpact === 'medium' ? 'text-terminal-warning' : 
                'text-terminal-text'
              }`}>
                {analysis.marketImpact?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !!analysis}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
              analysis 
                ? 'bg-terminal-accent/20 text-terminal-accent cursor-default'
                : analyzing
                ? 'bg-terminal-warning/20 text-terminal-warning cursor-wait'
                : 'bg-terminal-bg border border-terminal-border text-terminal-text/70 hover:text-terminal-accent hover:border-terminal-accent/50'
            }`}
          >
            <Brain className={`w-3 h-3 ${analyzing ? 'animate-pulse' : ''}`} />
            {analyzing ? 'Analyzing...' : analysis ? 'Analyzed' : 'AI Analyze'}
          </button>
        </div>
        
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-terminal-text/70 hover:text-terminal-accent transition-colors"
        >
          <span>Read More</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

interface AIMarketAnalysisProps {
  title?: string;
}

export const AIMarketAnalysis: React.FC<AIMarketAnalysisProps> = ({
  title = "AI Market Analysis"
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'id'>('id'); // Default to Indonesian
  const [analysisEn, setAnalysisEn] = useState<string>('');
  const [analysisId, setAnalysisId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const recentNews = await newsService.fetchNews(); // Fetch general news data
      const newsDigest = recentNews.slice(0, 10).map(news => ({
        title: news.title,
        content: news.description,
        category: news.category
      }));      // Fetch English analysis
      try {
        const marketSummaryEn = await aiAnalysisService.summarizeMarketNews(newsDigest, 'English');
        setAnalysisEn(marketSummaryEn);
      } catch (errorEn) {
        console.error('Error generating English analysis:', errorEn);
        setAnalysisEn('Unable to generate English market analysis at this time. Please try again later.');
      }

      // Fetch Indonesian analysis
      try {
        const marketSummaryId = await aiAnalysisService.summarizeMarketNews(newsDigest, 'Indonesian');
        setAnalysisId(marketSummaryId);
      } catch (errorId) {
        console.error('Error generating Indonesian analysis:', errorId);
        setAnalysisId('Tidak dapat menghasilkan analisis pasar dalam Bahasa Indonesia saat ini. Silakan coba lagi nanti.');
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching news digest for analysis:', error);
      setAnalysisEn('Failed to load data for English analysis due to news fetching error.');
      setAnalysisId('Gagal memuat data untuk analisis Bahasa Indonesia karena kesalahan pengambilan berita.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateAnalysis();
    
    const interval = setInterval(generateAnalysis, 3600000); // Auto-refresh every hour
    return () => clearInterval(interval);
  }, []);

  const renderAnalysisWithBold = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Regex to find **text** and replace it with <strong>text</strong>
      // It handles multiple occurrences in a single line.
      const parts = line.split(/(\*{2}.*?\*{2})/g); // Split by **...** but keep the delimiters
      return (
        <p key={index} className="mb-1"> {/* Added mb-1 for slight spacing between paragraphs if needed */}
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
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
          <Brain className="w-4 h-4 text-terminal-accent" />
          <span className="text-terminal-accent font-semibold text-sm">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateAnalysis}
            className="text-terminal-text/70 hover:text-terminal-accent transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs text-terminal-text/50">
            {lastUpdate.toLocaleTimeString('id-ID')}
          </span>
        </div>
      </div>
      
      {/* Language Tabs */}
      <div className="px-4 pt-3 border-b border-terminal-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedLanguage('id')}
            className={`px-3 py-1.5 rounded-t-md text-xs transition-colors ${
              selectedLanguage === 'id'
                ? 'bg-terminal-accent/20 text-terminal-accent border-t border-x border-terminal-accent/30'
                : 'bg-terminal-bg/50 text-terminal-text/70 hover:text-terminal-accent hover:bg-terminal-accent/10'
            }`}
          >
            Analisis Bahasa Indonesia
          </button>
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`px-3 py-1.5 rounded-t-md text-xs transition-colors ${
              selectedLanguage === 'en'
                ? 'bg-terminal-accent/20 text-terminal-accent border-t border-x border-terminal-accent/30'
                : 'bg-terminal-bg/50 text-terminal-text/70 hover:text-terminal-accent hover:bg-terminal-accent/10'
            }`}
          >
            English Analysis
          </button>
        </div>
      </div>
      
      <div className="p-4 max-h-[600px] overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="text-center py-8">
            <Brain className="w-8 h-8 text-terminal-accent animate-pulse mx-auto mb-4" />
            <p className="text-terminal-text/70 mb-2">AI is analyzing market conditions...</p>
            <p className="text-xs text-terminal-text/50">This may take a few moments</p>
          </div>
        ) : (
          <div className="bg-terminal-accent/10 border border-terminal-accent/30 rounded-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-terminal-accent" />
              <span className="font-semibold text-terminal-accent">Market Intelligence Summary</span>
            </div>
            <div className="text-terminal-text/90 text-sm leading-relaxed whitespace-pre-wrap">
              {selectedLanguage === 'id' ? renderAnalysisWithBold(analysisId) : renderAnalysisWithBold(analysisEn)}
            </div>
            <div className="mt-4 pt-3 border-t border-terminal-border">
              <p className="text-xs text-terminal-text/50">
                Generated by AI • Last updated: {lastUpdate.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
