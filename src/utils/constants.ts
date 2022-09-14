import { ethers } from 'ethers';
import * as BetContractAbi from '../abis/BetABI.json';
import * as ERC721ContractABI from '../abis/erc721.json';

const NETWORK = process.env.NETWORK || 'goerli';
const PRIVATE_KEY = NETWORK === 'goerli' ? (process.env.PRIVATE_KEY || '') : (process.env.PRIVATE_KEY_MAINNET || '');

const BET_CONTRACT_ADDRESS = {
    'goerli': '0x4b0EaA2E00564C05E3923F2CD6085d5672ea6757',
    'mainnet': '0x1936168149EDa833881AfD97839eCE09d6c0CE3e'
};

export const node_url = {
    'goerli': {
        providerUrl: 'wss://eth-goerli.g.alchemy.com/v2/F4OJrReh68dcqg8nvo1QqqBAIaVLAO_Q',
        rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/F4OJrReh68dcqg8nvo1QqqBAIaVLAO_Q'
    },
    'mainnet': {
        providerUrl: 'wss://eth-mainnet.g.alchemy.com/v2/eVlYPyGudTtpkbKa_nxgIP-uvB6iKI3m',
        rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/eVlYPyGudTtpkbKa_nxgIP-uvB6iKI3m'
    }
};

export const provider = new ethers.providers.JsonRpcProvider(node_url[NETWORK].rpcUrl);

export const BetContract = new ethers.Contract(BET_CONTRACT_ADDRESS[NETWORK], BetContractAbi, provider);

export const adminSigner = new ethers.Wallet(PRIVATE_KEY, provider);

export const getERC721Contract = (nftAddress: string) => {
    return new ethers.Contract(nftAddress, ERC721ContractABI, provider);
};
