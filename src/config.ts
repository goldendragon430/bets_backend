export const REDIS_CONFIG = {
    HOST: 'redis://127.0.0.1:6379'
};

export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || '6d4fd1034a81f2f98db778237bc71a60',
    algorithms: ['HS256' as const],
};

export const getDBConfig = (): string => {
    const NETWORK = process.env.NETWORK || 'goerli';
    if (NETWORK === 'mainnet') {
        return process.env.PROD_DB_CONFIG as string;
    }
    return process.env.DB_CONFIG as string;
};

export const getSolanaRPC = (): string => {
    const NETWORK = process.env.NETWORK || 'devnet';
    if (NETWORK === 'mainnet') {
        return process.env.SOLANA_RPC_MAINNET as string;
    }
    return process.env.SOLANA_RPC_DEVNET as string || 'https://api.devnet.solana.com';
};
