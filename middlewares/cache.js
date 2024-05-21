const redisClient = require('../config/redis');

const cache = async (req, res, next) => {
  const key = req.originalUrl;

  try {
    const data = await redisClient.get(key);
    if (data) {
      return res.status(200).send(JSON.parse(data));
    }
    return next();
  } catch (err) {
    console.error('Redis error:', err);
    return next();
  }
};

const setCache = (key, data, ttl = 3600) => {
  try {
    redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to set cache:', err);
  }
};

module.exports = { cache, setCache };
