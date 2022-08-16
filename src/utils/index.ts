import { ethers } from 'ethers';
import { CONTRACT, node_url } from '../config';
import * as BetContractAbi from '../abis/bet.json';

export const rpcProvider = new ethers.providers.JsonRpcProvider(node_url.rpcUrl);
export const betContract = new ethers.Contract(CONTRACT.BET_CONTRACT, BetContractAbi, rpcProvider);

