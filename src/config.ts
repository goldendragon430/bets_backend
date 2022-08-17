/**
 * JWT config.
 */
export const jwt_config = {
    algorithms: ['HS256'],
    secret: 'KIPHX9DyuVeMQsu4'
};

export const node_url = {
    providerUrl: 'wss://eth-rinkeby.alchemyapi.io/v2/Kc6kXv6BEXbQ7zUa5QwE5Xk9hIE3KVbH',
    network: 'rinkeby',
    rpcUrl: 'https://eth-rinkeby.alchemyapi.io/v2/Kc6kXv6BEXbQ7zUa5QwE5Xk9hIE3KVbH'
};

export const CONTRACT = {
    'BET_CONTRACT': '0xfB8Bcc7a3269c65298bEB1092Dbd7bEDB10d9313'
};

export const REDIS_CONFIG = {
    HOST: 'redis://127.0.0.1:6379'
};
