/**
 * Simple in-memory cache for database queries
 * Reduces database load and improves response times
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class QueryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Clean expired entries every 5 minutes
    setInterval(() => this.cleanExpired(), 5 * 60 * 1000);
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    if (!this.enabled) return null;

    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    console.log(`[Cache] ✅ HIT for key: ${key}`);
    return entry.data as T;
  }

  /**
   * Set data in cache with TTL (time to live)
   */
  set<T>(key: string, data: T, ttl: number = 60000): void {
    if (!this.enabled) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    console.log(`[Cache] 💾 SET key: ${key} (TTL: ${ttl}ms)`);
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`[Cache] 🗑️ INVALIDATED key: ${key}`);
    }
  }

  /**
   * Invalidate all cache keys matching a pattern
   */
  invalidatePattern(pattern: string): void {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    if (count > 0) {
      console.log(`[Cache] 🗑️ INVALIDATED ${count} keys matching: ${pattern}`);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`[Cache] 🧹 CLEARED all cache (${size} entries)`);
  }

  /**
   * Clean expired entries
   */
  private cleanExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[Cache] 🧹 Cleaned ${cleaned} expired entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      enabled: this.enabled,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Enable or disable cache
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log(`[Cache] ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }
}

// Export singleton instance
export const queryCache = new QueryCache();

/**
 * Cache TTL constants (in milliseconds)
 */
export const CacheTTL = {
  SHORT: 30 * 1000,      // 30 seconds - for frequently changing data
  MEDIUM: 5 * 60 * 1000, // 5 minutes - for moderately stable data
  LONG: 30 * 60 * 1000,  // 30 minutes - for stable data
  HOUR: 60 * 60 * 1000,  // 1 hour - for very stable data
} as const;
