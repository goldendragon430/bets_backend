import * as dotenv from 'dotenv';
dotenv.config();

export const node_url = {
    providerUrl: 'wss://eth-goerli.g.alchemy.com/v2/F4OJrReh68dcqg8nvo1QqqBAIaVLAO_Q',
    network: 'georli',
    rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/F4OJrReh68dcqg8nvo1QqqBAIaVLAO_Q'
};

export const REDIS_CONFIG = {
    HOST: 'redis://127.0.0.1:6379'
};

export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || '6d4fd1034a81f2f98db778237bc71a60',
    algorithms: ['HS256' as const],
};