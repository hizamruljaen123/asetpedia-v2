import React, { useState, useEffect, useMemo } from 'react';
import aiAnalysis from '../services/aiAnalysis';
import { 
  Search, 
  Filter, 
  Clock, 
  ExternalLink, 
  TrendingUp, 
  Bookmark, 
  Share2, 
  Eye,
  Globe,
  ChevronRight,
  Star,
  AlertCircle,
  BarChart3,
  DollarSign,
  Zap,
  Users,
  RefreshCw,
  Bell,
  Calendar,
  Tag
} from 'lucide-react';
import newsService from '../services/newsService';
import type { NewsItem } from '../types';

import type { AIAnalysisResponse } from '../types';

interface ProfessionalNewsPageProps {
  className?: string;
}

interface NewsCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

interface TrendingTopic {
  keyword: string;
  articles: number;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
}

const ProfessionalNewsPage: React.FC<ProfessionalNewsPageProps> = ({ className = '' }) => {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [categoryAnalyses, setCategoryAnalyses] = useState<{[key: string]: AIAnalysisResponse}>({});
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analyzingCategory, setAnalyzingCategory] = useState<string>("");
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [filteredArticles, setFilteredArticles] = useState<NewsItem[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'trending' | 'relevance'>('newest');
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const categories: NewsCategory[] = [
    { id: 'all', name: 'Semua Berita', icon: <Globe className="w-4 h-4" />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', count: 0 },
    { id: 'economy', name: 'Ekonomi', icon: <BarChart3 className="w-4 h-4" />, color: 'bg-green-500/20 text-green-400 border-green-500/30', count: 0 },
    { id: 'business', name: 'Bisnis', icon: <DollarSign className="w-4 h-4" />, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', count: 0 },
    { id: 'technology', name: 'Teknologi', icon: <Zap className="w-4 h-4" />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', count: 0 },
    { id: 'markets', name: 'Pasar Modal', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-red-500/20 text-red-400 border-red-500/30', count: 0 },
    { id: 'politics', name: 'Politik', icon: <Users className="w-4 h-4" />, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', count: 0 },
  ];

  // Fetch and process news data
  const fetchNews = async (forceRefresh = false) => {
    setLoading(true);
    setLoadingNews(true);
    try {
      const newsData = await newsService.fetchNews(
        selectedCategory === 'all' ? undefined : selectedCategory,
        forceRefresh
      );
      
      setArticles(newsData);
      console.log("Raw news data:", newsData); // Add console log here
      setLastUpdate(new Date());
      
      // Set featured articles (top 5 most recent)
      setFeaturedArticles(newsData.slice(0, 5));

      // Generate trending topics
      const topics = await generateTrendingTopics(newsData);
      setTrendingTopics(topics);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setLoadingNews(false);
    }
  };

  // Generate trending topics from articles
  const generateTrendingTopics = async (newsData: NewsItem[]): Promise<TrendingTopic[]> => {
    try {
      // Extract keywords from titles and descriptions
      const keywords = new Map<string, number>();

      newsData.forEach(article => {
        const text = `${article.title} ${article.description}`.toLowerCase();
        const words = text.split(/\s+/).filter(word =>
          word.length > 4 &&
          !['yang', 'dengan', 'untuk', 'dalam', 'pada', 'dari', 'akan', 'dapat', 'adalah', 'telah', 'this', 'that', 'with', 'from', 'they', 'their', 'have', 'been', 'were', 'said'].includes(word)
        );

        words.forEach(word => {
          const clean = word.replace(/[^\w]/g, '');
          if (clean.length > 4) {
            keywords.set(clean, (keywords.get(clean) || 0) + 1);
          }
        });
      });

      // Get top trending keywords
      const trending = Array.from(keywords.entries())
        .filter(([, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([keyword, count]) => ({
          keyword: keyword.charAt(0).toUpperCase() + keyword.slice(1),
          articles: count,
          trend: Math.random() > 0.3 ? 'up' : (Math.random() > 0.5 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
          impact: count > 5 ? 'high' : (count > 3 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
        }));

      return trending;
    } catch (error) {
      console.error('Error generating trending topics:', error);
      // Return empty array as fallback
      return [];
    }
  };

  // Filter and sort articles
  useEffect(() => {
    let filtered = [...articles];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        (article.description || '').toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'trending':
        // Sort by a combination of recency and engagement (mock)
        filtered.sort((a, b) => {
          const aScore = new Date(a.publishedAt).getTime() + Math.random() * 1000000;
          const bScore = new Date(b.publishedAt).getTime() + Math.random() * 1000000;
          return bScore - aScore;
        });
        break;
      case 'relevance':
        // Sort by relevance to search query
        if (searchQuery) {
          filtered.sort((a, b) => {
            const aRelevance = (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                             (a.description?.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
            const bRelevance = (b.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                             (b.description?.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
            return bRelevance - aRelevance;
          });
        }
        break;
    }

    console.log("Filtered articles:", filtered); // Add console log here
    setFilteredArticles(filtered);
  }, [articles, searchQuery, selectedCategory, sortBy]);

  // Auto-refresh news
  useEffect(() => {
    fetchNews();
    
    const interval = setInterval(() => {
      fetchNews();
    }, 10 * 60 * 1000); // Refresh every 10 minutes
    
    return () => clearInterval(interval);
  }, [selectedCategory]);

  // Trigger analysis when category changes
 const CACHE_FILE = 'asetpedia-news-analysis.json';
 const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

 const checkAndLoadAnalysis = async () => {
   try {
     // Try to load from localStorage first (faster)
     const cachedStr = localStorage.getItem(CACHE_FILE);
     if (cachedStr) {
       const cache = JSON.parse(cachedStr);
       const now = new Date();
       const cacheTime = new Date(cache.timestamp);
       
       // If cache is less than 1 hour old, use it
       if ((now.getTime() - cacheTime.getTime()) < CACHE_DURATION) {
         setCategoryAnalyses(cache.analyses);
         return true;
       }
     }

     // Try loading from file as backup
     const response = await fetch(`/cache/${CACHE_FILE}`);
     if (response.ok) {
       const cache = await response.json();
       const now = new Date();
       const cacheTime = new Date(cache.timestamp);
       
       if ((now.getTime() - cacheTime.getTime()) < CACHE_DURATION) {
         setCategoryAnalyses(cache.analyses);
         localStorage.setItem(CACHE_FILE, JSON.stringify(cache));
         return true;
       }
     }
   } catch (error) {
     console.error('Error loading analysis cache:', error);
   }
   return false;
 };

 const saveAnalysisCache = async (analyses: {[key: string]: AIAnalysisResponse}) => {
   try {
     const cache = {
       timestamp: new Date().toISOString(),
       analyses,
       categories: categories.map(c => ({
         id: c.id,
         name: c.name
       }))
     };

     // Save to localStorage
     localStorage.setItem(CACHE_FILE, JSON.stringify(cache));

     // Save to file
     await fetch(`/cache/${CACHE_FILE}`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(cache)
     });

     console.log('Analysis cache saved:', new Date().toLocaleTimeString());
   } catch (error) {
     console.error('Error saving analysis cache:', error);
   }
 };

 // Analyze news by category
 const doAnalysis = async (newsData: NewsItem[]) => {
   if (loadingNews || analyzing) return;
   
   setAnalyzing(true);
   setAnalyzingCategory("preparing");
   try {
     // Wait a bit before starting analysis
     await new Promise(resolve => setTimeout(resolve, 1000));
     // Group articles by category
     const categoryGroups: { [key: string]: NewsItem[] } = {};
     newsData.forEach(article => {
       if (!categoryGroups[article.category]) {
         categoryGroups[article.category] = [];
       }
       categoryGroups[article.category].push(article);
     });

     // Analyze each category
     const newAnalyses: {[key: string]: AIAnalysisResponse} = {};
     for (const [category, categoryArticles] of Object.entries(categoryGroups)) {
       if (categoryArticles.length > 0 && category) {
         const categoryName = categories.find(c => c.id === category)?.name;
         if (!categoryName) {
           console.log(`Skipping undefined category: ${category}`);
           continue;
         }
         setAnalyzingCategory(categoryName);
         const headlines = {
           category,
           categoryName: categories.find(c => c.id === category)?.name || category,
           articles: categoryArticles
             .slice(0, 5)
             .map(article => ({
               title: article.title,
               description: article.description || '',
               source: article.source
             }))
         };

         try {
           const analysis = await aiAnalysis.analyzeNews(
             JSON.stringify(headlines),
             category
           );
           newAnalyses[category] = analysis;
           setCategoryAnalyses(prev => ({...prev, [category]: analysis}));
         } catch (error) {
           console.error(`Error analyzing ${category}:`, error);
         }

         // Always wait between categories to avoid rate limiting
         await new Promise(resolve => setTimeout(resolve, 2000));
       }
     }

     if (Object.keys(newAnalyses).length > 0) {
       await saveAnalysisCache(newAnalyses);
     }
   } catch (error) {
     console.error('Error in analysis:', error);
   } finally {
     setAnalyzing(false);
     setAnalyzingCategory("");
   }
 };

 // Handle analysis lifecycle
 useEffect(() => {
   let mounted = true;
   const lastAnalysisKey = 'last-analysis-time';

   const checkAndStartAnalysis = async () => {
     if (!mounted || analyzing || articles.length === 0) return;

     try {
       // Check last analysis time
       const lastAnalysis = localStorage.getItem(lastAnalysisKey);
       if (lastAnalysis) {
         const lastTime = new Date(lastAnalysis).getTime();
         const now = new Date().getTime();
         if (now - lastTime < CACHE_DURATION) {
           // Load from cache if available
           await checkAndLoadAnalysis();
           return;
         }
       }

       // Wait for articles to load
       if (!loadingNews) {
         // Check cache one more time before analysis
         const hasValidCache = await checkAndLoadAnalysis();
         if (!hasValidCache) {
           await doAnalysis(articles);
           localStorage.setItem(lastAnalysisKey, new Date().toISOString());
         }
       }
     } catch (error) {
       console.error('Error in analysis:', error);
     }
   };

   checkAndStartAnalysis();

   return () => {
     mounted = false;
   };
 }, [articles.length, loadingNews]);

  // Update category counts
  useEffect(() => {
    categories.forEach(cat => {
      if (cat.id === 'all') {
        cat.count = articles.length;
      } else {
        cat.count = articles.filter(article => 
          article.category.toLowerCase() === cat.id.toLowerCase()
        ).length;
      }
    });
  }, [articles]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedAt = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishedAt.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam lalu`;
    return `${Math.floor(diffInMinutes / 1440)} hari lalu`;
  };

  const toggleSaveArticle = (articleId: string) => {
    const newSaved = new Set(savedArticles);
    if (newSaved.has(articleId)) {
      newSaved.delete(articleId);
    } else {
      newSaved.add(articleId);
    }
    setSavedArticles(newSaved);
  };

  const shareArticle = async (article: NewsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(article.url || '');
      alert('Link artikel telah disalin ke clipboard!');
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      default: return <div className="w-3 h-3 bg-yellow-400 rounded-full" />;
    }
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
    }
  };

  return (
    <div className={"min-h-screen bg-terminal-bg text-terminal-text " + className}>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-indigo-900/30 border-b border-terminal-border sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-terminal-accent" />
                <h1 className="text-xl font-bold text-terminal-text">Berita Profesional</h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-terminal-text/70">
                <Clock className="w-4 h-4" />
                <span>Update terakhir: {lastUpdate.toLocaleTimeString('id-ID')}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchNews(true)}
                disabled={loading}
                className={"flex items-center gap-2 px-3 py-2 bg-terminal-accent/10 border border-terminal-accent/30 rounded-lg hover:bg-terminal-accent/20 transition-colors disabled:opacity-50"}
              >
                <RefreshCw className={"w-4 h-4 " + (loading ? 'animate-spin' : '')} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-terminal-text/70" />
                <span className="text-sm font-medium">{filteredArticles.length}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            {/* Search and Filter */}
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-text/50" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-terminal-surface/50 border border-terminal-border rounded-lg focus:outline-none focus:border-terminal-accent text-terminal-text placeholder-terminal-text/50"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'trending' | 'relevance')}
                className="px-4 py-2 bg-terminal-surface/50 border border-terminal-border rounded-lg focus:outline-none focus:border-terminal-accent text-terminal-text"
              >
                <option value="newest">Terbaru</option>
                <option value="trending">Trending</option>
                <option value="relevance">Relevansi</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={"flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap " + (
                    selectedCategory === cat.id
                      ? cat.color
                      : 'bg-terminal-surface/30 border-terminal-border text-terminal-text/70 hover:border-terminal-accent/50'
                  )}
                >
                  {cat.icon}
                  <span className="text-sm font-medium">{cat.name}</span>
                  {cat.count > 0 && (
                    <span className="text-xs bg-terminal-bg/50 px-2 py-1 rounded-full">
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Articles */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Berita Utama
              </h2>
              
              {loading && featuredArticles.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-terminal-surface/30 border border-terminal-border rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-terminal-border rounded mb-3"></div>
                      <div className="h-3 bg-terminal-border/50 rounded mb-2"></div>
                      <div className="h-3 bg-terminal-border/50 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredArticles.map((article) => (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-terminal-surface/30 border border-terminal-border rounded-lg p-6 hover:bg-terminal-surface/50 hover:border-terminal-accent/30 transition-all group block"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs px-2 py-1 bg-terminal-accent/20 text-terminal-accent rounded-full font-medium">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSaveArticle(article.id)}
                            className={"p-1 rounded hover:bg-terminal-accent/10 transition-colors " + (
                              savedArticles.has(article.id) ? 'text-yellow-400' : 'text-terminal-text/50'
                            )}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => shareArticle(article)}
                            className="p-1 rounded hover:bg-terminal-accent/10 transition-colors text-terminal-text/50 hover:text-terminal-accent"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-3 text-terminal-text group-hover:text-terminal-accent transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-terminal-text/70 text-sm mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-terminal-text/50">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(article.publishedAt)}</span>
                        </div>
                        
                        <span className="flex items-center gap-1 text-xs text-terminal-accent hover:text-terminal-accent/80 transition-colors">
                          <span>Baca</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </section>

            {/* All Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Filter className="w-5 h-5 text-terminal-accent" />
                  Semua Berita ({filteredArticles.length})
                </h2>
                
                {searchQuery && (
                  <div className="text-sm text-terminal-text/70">
                    Hasil pencarian untuk: <span className="text-terminal-accent">"{searchQuery}"</span>
                  </div>
                )}
              </div>
              
                  {loading && filteredArticles.length === 0 ? (
                    <div className="space-y-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-terminal-surface/30 border border-terminal-border rounded-lg p-6 animate-pulse">
                          <div className="h-4 bg-terminal-border rounded mb-3 w-3/4"></div>
                          <div className="h-3 bg-terminal-border/50 rounded mb-2"></div>
                          <div className="h-3 bg-terminal-border/50 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-terminal-text/30 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-terminal-text/70 mb-2">Tidak ada berita ditemukan</h3>
                      <p className="text-terminal-text/50">Coba ubah filter atau kata kunci pencarian</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-[1000px] max-h-[1000px] overflow-y-auto">
                      {/* AI Analysis Box */}
                      <div className="bg-terminal-surface/40 border border-terminal-accent/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-terminal-accent flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Analisis AI
                          </h3>
                          {(analyzing || loadingNews) && (
                            <div className="flex items-center gap-2 text-sm text-terminal-accent">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Menganalisis...</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Category Tabs */}
                        <div className="mb-4">
                          <div className="flex overflow-x-auto -mx-4 px-4 pb-2 space-x-2">
                            {categories.map(category => (
                              <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
                                  selectedCategory === category.id
                                    ? 'bg-terminal-accent/10 border-terminal-accent text-terminal-accent'
                                    : 'border-transparent text-terminal-text/70 hover:text-terminal-text hover:bg-terminal-accent/5'
                                }`}
                              >
                                {category.icon}
                                <span className="text-sm">{category.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                          <div className="space-y-4 min-h-[200px] relative">
                            {analyzing && (
                              <div className="absolute inset-0 flex items-center justify-center bg-terminal-bg/50 backdrop-blur-sm z-10 rounded-lg">
                                <div className="flex items-center gap-3 bg-terminal-surface/80 px-4 py-2 rounded-lg border border-terminal-accent/30">
                                  <RefreshCw className="w-5 h-5 animate-spin text-terminal-accent" />
                                  <span className="text-sm">
                                    {loadingNews ? 'Memuat berita...' :
                                     analyzingCategory ? `Menganalisis ${categories.find(c => c.id === analyzingCategory)?.name}...` :
                                     'Menganalisis...'}
                                  </span>
                                </div>
                              </div>
                            )}
                            {selectedCategory !== 'all' ? (
                              categoryAnalyses[selectedCategory] ? (
                                <div className="space-y-4 min-h-[200px]">
                                  <div className="text-sm text-terminal-text">
                                    <h4 className="font-medium mb-2">{categories.find(c => c.id === selectedCategory)?.name}</h4>
                                    <p className="text-terminal-text/70 mb-3">{categoryAnalyses[selectedCategory].summary}</p>
                                    <div className="mb-3">
                                      <div className="font-medium mb-1">Poin Utama:</div>
                                      <ul className="list-disc list-inside space-y-1 text-terminal-text/70">
                                        {categoryAnalyses[selectedCategory].keyPoints?.map((point: string, i: number) => (
                                          <li key={i}>{point}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {categoryAnalyses[selectedCategory].keywords?.map((keyword: string, i: number) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-terminal-accent/10 text-terminal-accent rounded-full">
                                          {keyword}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                      <span className={`px-2 py-1 rounded-full ${
                                        categoryAnalyses[selectedCategory].sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                        categoryAnalyses[selectedCategory].sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                      }`}>
                                        Sentiment: {categoryAnalyses[selectedCategory].sentiment}
                                      </span>
                                      <span className={`px-2 py-1 rounded-full ${
                                        categoryAnalyses[selectedCategory].marketImpact === 'high' ? 'bg-red-500/20 text-red-400' :
                                        categoryAnalyses[selectedCategory].marketImpact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-green-500/20 text-green-400'
                                      }`}>
                                        Impact: {categoryAnalyses[selectedCategory].marketImpact}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-terminal-text/70">
                                  {analyzing ? (
                                    analyzingCategory ?
                                      `Menganalisis ${analyzingCategory}...` :
                                      'Mempersiapkan analisis...'
                                  ) : 'Analisis tidak tersedia'}
                                </div>
                              )
                            ) : (
                              // Show summaries for all categories
                              <div className="space-y-4">
                                {categories.slice(1).map(category => (
                                  <div key={category.id} className="border-t border-terminal-border/30 pt-4 first:border-0 first:pt-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      {category.icon}
                                      <h4 className="font-medium">{category.name}</h4>
                                    </div>
                                    {categoryAnalyses[category.id]?.summary ? (
                                      <p className="text-sm text-terminal-text/70 mb-2">
                                        {categoryAnalyses[category.id].summary}
                                      </p>
                                    ) : (
                                      <p className="text-sm text-terminal-text/50 italic mb-2">
                                        Analisis tidak tersedia
                                      </p>
                                    )}
                                    {categoryAnalyses[category.id] ? (
                                      <div className="flex gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                          categoryAnalyses[category.id].sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                          categoryAnalyses[category.id].sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                          'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                          {categoryAnalyses[category.id].sentiment || 'Netral'}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                          categoryAnalyses[category.id].marketImpact === 'high' ? 'bg-red-500/20 text-red-400' :
                                          categoryAnalyses[category.id].marketImpact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                          'bg-green-500/20 text-green-400'
                                        }`}>
                                          Impact: {categoryAnalyses[category.id].marketImpact || 'Low'}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex gap-2">
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                                          Belum dianalisis
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      {filteredArticles.map((article) => (
                        <a
                          key={article.id}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-terminal-surface/30 border border-terminal-border rounded-lg p-6 hover:bg-terminal-surface/50 hover:border-terminal-accent/30 transition-all group block"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-terminal-accent/20 text-terminal-accent rounded-full font-medium">
                                {article.category}
                              </span>
                              <span className="text-xs text-terminal-text/50">{article.source}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleSaveArticle(article.id)}
                                className={`p-1 rounded hover:bg-terminal-accent/10 transition-colors ${
                                  savedArticles.has(article.id) ? 'text-yellow-400' : 'text-terminal-text/50'
                                }`}
                              >
                                <Bookmark className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => shareArticle(article)}
                                className="p-1 rounded hover:bg-terminal-accent/10 transition-colors text-terminal-text/50 hover:text-terminal-accent"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-3 text-terminal-text group-hover:text-terminal-accent transition-colors">
                            {article.title}
                          </h3>
                          
                          <p className="text-terminal-text/70 text-sm mb-4 line-clamp-2">
                            {article.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-terminal-text/50">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(article.publishedAt)}</span>
                            </div>
                            
                            <span className="flex items-center gap-1 text-sm text-terminal-accent hover:text-terminal-accent/80 transition-colors">
                              <span>Baca Selengkapnya</span>
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              </div>
    
              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Trending Topics */}
                <div className="bg-terminal-surface/30 border border-terminal-border rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-terminal-accent" />
                    Topik Trending
                  </h3>
                  
                  <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-terminal-bg/50 rounded-lg hover:bg-terminal-accent/10 transition-colors cursor-pointer"
                        onClick={() => setSearchQuery(topic.keyword)}
                      >
                        <div className="flex items-center gap-3">
                          {getTrendIcon(topic.trend)}
                          <div>
                            <div className="font-medium text-sm">{topic.keyword}</div>
                            <div className="text-xs text-terminal-text/50">{topic.articles} artikel</div>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(topic.impact)}`}>
                          {topic.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
    
                {/* Quick Stats */}
                <div className="bg-terminal-surface/30 border border-terminal-border rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-terminal-accent" />
                    Statistik
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-text/70">Total Artikel</span>
                      <span className="font-bold text-terminal-accent">{articles.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-text/70">Artikel Tersimpan</span>
                      <span className="font-bold text-yellow-400">{savedArticles.size}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-text/70">Kategori Aktif</span>
                      <span className="font-bold text-green-400">
                        {categories.filter(cat => cat.count > 0).length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-text/70">Update Terakhir</span>
                      <span className="text-xs text-terminal-text/50">
                        {lastUpdate.toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
    
                {/* Recent Sources */}
                <div className="bg-terminal-surface/30 border border-terminal-border rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-terminal-accent" />
                    Sumber Terbaru
                  </h3>
                  
                  <div className="space-y-2">
                    {Array.from(new Set(articles.slice(0, 10).map(article => article.source))).slice(0, 5).map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-terminal-bg/30 rounded hover:bg-terminal-accent/10 transition-colors"
                      >
                        <span className="text-sm text-terminal-text/80">{source}</span>
                        <span className="text-xs text-terminal-text/50">
                          {articles.filter(article => article.source === source).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      );
    };
    
    export default ProfessionalNewsPage;
