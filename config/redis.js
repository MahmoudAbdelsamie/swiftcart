const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis error:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('end', () => {
    console.warn('Redis client disconnected, attempting to reconnect...');
    client.connect().catch((err) => console.error('Failed to reconnect to Redis:', err));
});

client.connect().catch((err) => {
    console.error('Initial Redis connection failed:', err);
});

module.exports = client;
