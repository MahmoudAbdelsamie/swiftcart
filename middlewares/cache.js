const redisClient = require('../config/redis');

exports.cache = (req, res, next) => {
  const key = req.originalUrl;

  redisClient.get(key, (err, data) => {
    if (err) {
      console.error('Redis error:', err);
      return next();
    }
    if (data) {
      return res.status(200).send(JSON.parse(data));
    }
    return next();
  });
};

const setCache = (key, data, ttl = 3600) => {
  redisClient.setex(key, ttl, JSON.stringify(data));
};

// module.exports = { cache, setCache };
