import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { CONTRACT, node_url } from '../config';
dotenv.config();
import * as BetContractAbi from '../abis/BetABI.json';

export const installBetEvents = () => {
    const wsProvider = new ethers.providers.WebSocketProvider(node_url.rpcUrl);
    const contract = new ethers.Contract(CONTRACT.BET_CONTRACT, BetContractAbi, wsProvider);

    contract.on('NFTStaked', (collectionAddress, user, tokenIds) => {
        console.log(collectionAddress);
        console.log(user);
        console.log(tokenIds);
    });

    console.log('Initialized Bet Events');
};
