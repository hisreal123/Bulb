import { createClient, RedisClientType } from 'redis';

/**
 * Redis connection
 */
class RedisClient {
  /**
   * connetion to redis-sever
   */

  client: RedisClientType;
  isClientConnected: boolean;

  constructor() {
    this.client = createClient();
    this.isClientConnected = true;

    this.client
      .connect()
      .then(() => {
        this.isClientConnected = true;
        console.log('Redis connected');
      })
      .catch((_err: string) => {
        console.log('Redis connection failed');
        this.isClientConnected = false;
      });
  }

  isActive(): boolean {
    return this.isClientConnected;
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(
    key: string,
    value: number | string,
    expire: number
  ): Promise<boolean> {
    if (!this.isActive()) {
      throw new Error('Redis client is not connected');
    }
    try {
      await this.client.set(key, value, { EX: expire });
      return true;
    } catch (error) {
      console.error('Error setting key in Redis', error);
      throw error;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isActive()) {
      throw new Error('Redis client is not connected');
    }
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Error deleting key in Redis', error);
      throw error;
    }
  }
}

export const redisClient = new RedisClient();
export default redisClient;
