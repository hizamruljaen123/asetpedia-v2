import type { NewsItem } from '../types';

// Explicitly type the imported JSON data
interface RssFeedItemFromFile {
  name: string;
  url: string;
  category: string;
}
import rssFeedDataJson from '../assets/rss_feeds.json';
// Assert the type of the imported JSON
const rssFeedData: RssFeedItemFromFile[] = rssFeedDataJson as RssFeedItemFromFile[];

interface RssSource {
  name: string;
  url: string;
  category: string;
  source: string; // Added for consistency with previous structure
}

export class NewsService {
  private rssSources: RssSource[];

  constructor() {
    this.rssSources = rssFeedData.map((feed: RssFeedItemFromFile) => ({
      name: feed.name,
      url: feed.url,
      category: feed.category.toLowerCase(),
      source: feed.name, // Use name as source
    }));
  }

  private cache = new Map<string, NewsItem[]>();
  private lastFetch = new Map<string, number>();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  /**
   * Fetch news from RSS feeds
   * @param category - News category to fetch
   * @param forceRefresh - Force refresh cache
   * @returns Array of news items
   */
  async fetchNews(
    category?: string, 
    forceRefresh = false
  ): Promise<NewsItem[]> {
    const cacheKey = category || 'all';
    const now = Date.now();
    const lastFetchTime = this.lastFetch.get(cacheKey) || 0;

    // Check cache validity
    if (!forceRefresh && this.cache.has(cacheKey) && (now - lastFetchTime) < this.CACHE_DURATION) {
      return this.cache.get(cacheKey) || [];
    }

    try {
      const sourcesToFetch = category 
        ? this.rssSources.filter(source => source.category === category)
        : this.rssSources;

      const newsPromises = sourcesToFetch.map(source => this.fetchFromSource(source));
      const newsResults = await Promise.allSettled(newsPromises);

      const allNews: NewsItem[] = [];
      newsResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allNews.push(...result.value);
        } else {
          console.warn(`Failed to fetch from ${sourcesToFetch[index].source}:`, result.reason);
        }
      });

      // Sort by publish date (newest first)
      allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Cache results
      this.cache.set(cacheKey, allNews);
      this.lastFetch.set(cacheKey, now);

      return allNews;

    } catch (error) {
      console.error('Error fetching news:', error);
      return this.cache.get(cacheKey) || [];
    }
  }

  /**
   * Fetch news from a single RSS source
   * @param source - RSS source configuration
   * @returns Array of news items
   */
  private async fetchFromSource(source: {
    url: string;
    category: string; 
    source: string; // This matches the RssSource interface now
  }): Promise<NewsItem[]> {
    try {
      const proxyUrl = source.url; 
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      const items = xmlDoc.querySelectorAll('item');
      const newsItems: NewsItem[] = [];

      items.forEach((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();

        if (title && description) {
          newsItems.push({
            id: `${source.source}-${index}-${Date.now()}`,
            title: this.cleanText(title),
            description: this.cleanText(description),
            content: this.cleanText(description), // RSS usually provides summary in description
            url: link,
            source: source.source,
            category: source.category, // This should now be fine
            publishedAt: this.parseDate(pubDate),
          });
        }
      });

      return newsItems;

    } catch (error) {
      console.error(`Error fetching from ${source.source}:`, error);
      return [];
    }
  }

  /**
   * Search for additional sources on a specific topic
   * @param topic - Topic to search for
   * @param limit - Maximum number of sources to find
   * @returns Array of additional news items
   */
  async searchAdditionalSources(topic: string, limit = 10): Promise<NewsItem[]> {
    try {
      // Simulate searching additional sources
      // In a real implementation, you would use news APIs like NewsAPI, Google News API, etc.
      const searchResults: NewsItem[] = [];

      // Mock additional sources for demonstration
      const mockSources = [
        'Financial Times', 'MarketWatch', 'Yahoo Finance', 'CNBC', 'Forbes',
        'Business Insider', 'Economic Times', 'The Economist', 'Reuters', 'Associated Press'
      ];

      for (let i = 0; i < Math.min(limit, mockSources.length); i++) {
        searchResults.push({
          id: `search-${topic}-${i}-${Date.now()}`,
          title: `${topic} - Latest Analysis from ${mockSources[i]}`,
          description: `Comprehensive analysis of ${topic} and its market implications...`,
          content: `Detailed coverage of ${topic} including expert opinions and market analysis...`,
          url: `https://example.com/news/${topic.toLowerCase().replace(/\s+/g, '-')}`,
          source: mockSources[i],
          category: topic, // This should now be fine
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      return searchResults;

    } catch (error) {
      console.error('Error searching additional sources:', error);
      return [];
    }
  }

  /**
   * Get trending topics based on news frequency
   * @returns Array of trending topics
   */
  async getTrendingTopics(): Promise<string[]> {
    try {
      const allNews = await this.fetchNews();
      const topicCounts = new Map<string, number>();

      allNews.forEach(item => {
        const words = item.title.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 4) { // Filter out short words
            topicCounts.set(word, (topicCounts.get(word) || 0) + 1);
          }
        });
      });

      return Array.from(topicCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([topic]) => topic);

    } catch (error) {
      console.error('Error getting trending topics:', error);
      return ['markets', 'economy', 'technology', 'business', 'politics'];
    }
  }

  /**
   * Clean text by removing HTML tags and extra whitespace
   */
  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Parse RSS date formats
   */
  private parseDate(dateString: string): string {
    try {
      return new Date(dateString).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.lastFetch.clear();
  }
}

export default new NewsService();
