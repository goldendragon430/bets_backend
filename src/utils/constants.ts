import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as BetContractAbi from '../abis/BetABI.json';
import * as ERC721ContractABI from '../abis/erc721.json';
dotenv.config();

const NETWORK = process.env.NETWORK || 'goerli';
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'goerli';

const BET_CONTRACT_ADDRESS = {
    'goerli': '0x201DC5376941ca9F079AA934bC64ace62c347e20'
};

export const node_url = {
    providerUrl: 'wss://eth-goerli.g.alchemy.com/v2/F4OJrReh68dcqg8nvo1QqqBAIaVLAO_Q',
    network: 'georli',
    rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/F4OJrReh68dcqg8nvo1QqqBAIaVLAO_Q'
};

export const REDIS_CONFIG = {
    HOST: 'redis://127.0.0.1:6379'
};

export const provider = new ethers.providers.JsonRpcProvider(node_url.rpcUrl);

export const BetContract = new ethers.Contract(BET_CONTRACT_ADDRESS[NETWORK], BetContractAbi, provider);

export const getERC721Contract = (nftAddress: string) => {
    return new ethers.Contract(nftAddress, ERC721ContractABI, provider);
};

export const adminSigner = new ethers.Wallet(PRIVATE_KEY, provider);