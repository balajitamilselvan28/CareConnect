const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');

// Promisify Redis methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

// Cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await getAsync(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      // Store original res.json
      const originalJson = res.json;

      // Override res.json
      res.json = async (body) => {
        await setAsync(key, JSON.stringify(body), 'EX', duration);
        originalJson.call(res, body);
      };

      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Clear cache for a specific key
const clearCache = async (key) => {
  try {
    await delAsync(key);
  } catch (error) {
    console.error('Clear cache error:', error);
  }
};

// Clear cache by pattern
const clearCacheByPattern = async (pattern) => {
  try {
    const keys = await promisify(client.keys).bind(client)(pattern);
    if (keys.length > 0) {
      await Promise.all(keys.map(key => delAsync(key)));
    }
  } catch (error) {
    console.error('Clear cache by pattern error:', error);
  }
};

module.exports = {
  cache,
  clearCache,
  clearCacheByPattern
}; 