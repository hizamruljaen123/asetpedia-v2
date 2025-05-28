import React, { useState, useEffect } from 'react';
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
  Users
} from 'lucide-react';
import newsService from '../services/newsService';
import type { NewsItem } from '../types';

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
    try {
      const newsData = await newsService.fetchNews(
        selectedCategory === 'all' ? undefined : selectedCategory,
        forceRefresh
      );
      
      setArticles(newsData);
      setLastUpdate(new Date());
      
      // Set featured articles (top 5 most recent)
      setFeaturedArticles(newsData.slice(0, 5));
      
      // Generate trending topics
      await generateTrendingTopics(newsData);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate trending topics from articles
  const generateTrendingTopics = async (newsData: NewsItem[]) => {
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

      setTrendingTopics(trending);
    } catch (error) {
      console.error('Error generating trending topics:', error);
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
    <div className={`min-h-screen bg-terminal-bg text-terminal-text ${className}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-indigo-900/30 border-b border-terminal-border sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-terminal-text">ASETPEDIA News</h1>
                  <p className="text-terminal-text/60 text-sm">Portal Berita Keuangan Profesional</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-terminal-text/60">Terakhir diperbarui</div>
                <div className="text-sm text-terminal-text font-medium">
                  {lastUpdate.toLocaleTimeString('id-ID')}
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">LIVE</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-text/50" />
              <input
                type="text"
                placeholder="Cari berita, perusahaan, atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-terminal-surface/80 backdrop-blur border border-terminal-border rounded-lg text-terminal-text placeholder-terminal-text/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'trending' | 'relevance')}
                className="px-4 py-2 bg-terminal-surface/80 backdrop-blur border border-terminal-border rounded-lg text-terminal-text focus:border-blue-500 focus:outline-none"
              >
                <option value="newest">Terbaru</option>
                <option value="trending">Trending</option>
                <option value="relevance">Relevansi</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-2 bg-terminal-surface/80 backdrop-blur border border-terminal-border rounded-lg text-terminal-text hover:bg-terminal-surface transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured News Section */}
            {featuredArticles.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-terminal-text mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Berita Utama
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Featured Article */}
                  <div className="md:col-span-2">
                    <div className="relative bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden hover:border-blue-500/30 transition-colors group">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 text-xs rounded-full border ${categories.find(c => c.id === featuredArticles[0].category.toLowerCase())?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                            {featuredArticles[0].category}
                          </span>
                          <span className="text-terminal-text/60 text-sm">{featuredArticles[0].source}</span>
                          <span className="text-terminal-text/60 text-sm">{formatTimeAgo(featuredArticles[0].publishedAt)}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-terminal-text mb-3 group-hover:text-blue-400 transition-colors">
                          {featuredArticles[0].title}
                        </h3>
                        
                        <p className="text-terminal-text/80 mb-4 line-clamp-3">
                          {featuredArticles[0].description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleSaveArticle(featuredArticles[0].id)}
                              className={`p-2 rounded-lg transition-colors ${
                                savedArticles.has(featuredArticles[0].id)
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-terminal-surface/50 text-terminal-text/60 hover:bg-yellow-500/20 hover:text-yellow-400'
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => shareArticle(featuredArticles[0])}
                              className="p-2 bg-terminal-surface/50 text-terminal-text/60 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <a
                            href={featuredArticles[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Baca Selengkapnya
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Featured Articles */}
                  {featuredArticles.slice(1, 3).map((article) => (
                    <div key={article.id} className="bg-terminal-surface border border-terminal-border rounded-lg p-4 hover:border-blue-500/30 transition-colors group">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full border ${categories.find(c => c.id === article.category.toLowerCase())?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                          {article.category}
                        </span>
                        <span className="text-terminal-text/60 text-xs">{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                      
                      <h4 className="text-base font-semibold text-terminal-text mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      
                      <p className="text-terminal-text/70 text-sm mb-3 line-clamp-2">
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-terminal-text/60 text-xs">{article.source}</span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Categories Navigation */}
            <section>
              <div className="flex items-center gap-3 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      selectedCategory === category.id
                        ? category.color
                        : 'bg-terminal-surface/50 text-terminal-text/70 border-terminal-border hover:bg-terminal-surface'
                    }`}
                  >
                    {category.icon}
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* News Articles List */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-terminal-text">
                  {selectedCategory === 'all' ? 'Semua Berita' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-terminal-text/60">
                  {filteredArticles.length} artikel ditemukan
                </span>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-terminal-text/70">Memuat berita terbaru...</p>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-8 h-8 text-terminal-text/50 mx-auto mb-4" />
                  <p className="text-terminal-text/70">Tidak ada artikel yang ditemukan</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredArticles.map((article, index) => (
                    <article
                      key={article.id || index}
                      className="bg-terminal-surface border border-terminal-border rounded-lg p-6 hover:border-blue-500/30 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs rounded-full border ${categories.find(c => c.id === article.category.toLowerCase())?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                            {article.category}
                          </span>
                          <span className="text-terminal-text/60 text-sm">{article.source}</span>
                        </div>
                        <div className="flex items-center gap-2 text-terminal-text/60 text-sm">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(article.publishedAt)}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-terminal-text mb-3 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-terminal-text/80 mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleSaveArticle(article.id)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                              savedArticles.has(article.id)
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-terminal-surface/50 text-terminal-text/60 hover:bg-yellow-500/20 hover:text-yellow-400'
                            }`}
                          >
                            <Bookmark className="w-3 h-3" />
                            {savedArticles.has(article.id) ? 'Tersimpan' : 'Simpan'}
                          </button>
                          
                          <button
                            onClick={() => shareArticle(article)}
                            className="flex items-center gap-2 px-3 py-1 bg-terminal-surface/50 text-terminal-text/60 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg text-sm transition-colors"
                          >
                            <Share2 className="w-3 h-3" />
                            Bagikan
                          </button>
                        </div>
                        
                        {article.url && (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                          >
                            Baca Artikel Lengkap
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-terminal-text mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Topik Trending
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-terminal-bg/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(topic.trend)}
                      <div>
                        <div className="text-sm font-medium text-terminal-text">{topic.keyword}</div>
                        <div className="text-xs text-terminal-text/60">{topic.articles} artikel</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(topic.impact)}`}>
                      {topic.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Summary */}
            <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-terminal-text mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Ringkasan Pasar
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-terminal-bg/50 rounded">
                  <span className="text-sm text-terminal-text/70">IHSG</span>
                  <span className="text-sm font-medium text-green-400">+0.84%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-terminal-bg/50 rounded">
                  <span className="text-sm text-terminal-text/70">USD/IDR</span>
                  <span className="text-sm font-medium text-red-400">-0.12%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-terminal-bg/50 rounded">
                  <span className="text-sm text-terminal-text/70">Bitcoin</span>
                  <span className="text-sm font-medium text-green-400">+2.31%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-terminal-bg/50 rounded">
                  <span className="text-sm text-terminal-text/70">Emas</span>
                  <span className="text-sm font-medium text-yellow-400">+0.45%</span>
                </div>
              </div>
            </div>

            {/* Saved Articles */}
            {savedArticles.size > 0 && (
              <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-terminal-text mb-4 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-yellow-400" />
                  Artikel Tersimpan
                </h3>
                <div className="text-center">
                  <span className="text-2xl font-bold text-terminal-text">{savedArticles.size}</span>
                  <p className="text-sm text-terminal-text/60">artikel disimpan</p>
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-terminal-text mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" />
                Statistik
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-terminal-text/70 text-sm">Total Artikel</span>
                  <span className="text-terminal-text font-medium">{articles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-text/70 text-sm">Sumber Berita</span>
                  <span className="text-terminal-text font-medium">
                    {new Set(articles.map(a => a.source)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-text/70 text-sm">Kategori</span>
                  <span className="text-terminal-text font-medium">
                    {new Set(articles.map(a => a.category)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-text/70 text-sm">Update Terakhir</span>
                  <span className="text-terminal-text font-medium text-xs">
                    {lastUpdate.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalNewsPage;
