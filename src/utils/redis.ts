import { createClient } from 'redis';
import { REDIS_CONFIG } from '../config';

class CRedis {
    redisClient: any;

    constructor() {
        this.redisClient = undefined;
    }

    async init() {
        try {
            this.redisClient = createClient({
                url: REDIS_CONFIG.HOST
            });

            await this.redisClient.connect();
        } catch (err) {
            console.error('redis init err: ', err);
        }
    }

    onError() {
        this.redisClient.on('error', (err) => {
            console.log('redisClient error :' + err);
        });
    }

    onConnect() {
        this.redisClient.on('connect', () => {
            console.log('redisClient connect');
        });
    }

    getRedisClient() {
        return this.redisClient;
    }

    async initVaule(key: string, defaultValue: number): Promise<number> {
        try {
            const res = await this.redisClient.get(key);

            if (res == undefined) {
                await this.redisClient.set(key, defaultValue);
            } else {
                defaultValue = parseInt(res);
            }

            return defaultValue;
        } catch (e) {
            console.error('redis server error: ', e);
            return defaultValue;
        }
    }

    async get(key: string): Promise<number> {
        try {
            const res = await this.redisClient.get(key);

            if (res == undefined) {
                return 0;
            } else {
                return parseInt(res);
            }
        } catch (e) {
            console.error('redis server error: ', e);
            return 0;
        }
    }

    async set(key: string, value: number) {
        try {
            await this.redisClient.set(key, value);
        } catch (e) {
            console.error('redis server error: ', e);
        }
    }
}

const redisHandle = new CRedis();
export default redisHandle;
