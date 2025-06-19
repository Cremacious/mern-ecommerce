import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  retryDelayOnFailover: 100,
  retryDelayOnClusterDown: 300,
  retryDelayOnExecError: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

// Handle Redis connection events
redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

redis.on('ready', () => {
  console.log('🚀 Redis is ready to use');
});

// Test connection function
export const connectRedis = async () => {
  try {
    await redis.ping();
    console.log('✅ Redis connection test successful');
  } catch (error) {
    console.error('❌ Redis connection test failed:', error.message);
  }
};
