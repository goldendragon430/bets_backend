import { ethers } from 'ethers';
import { node_url } from '../config';

export const rpcProvider = new ethers.providers.JsonRpcProvider(node_url.rpcUrl);
