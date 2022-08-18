import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { CONTRACT, node_url } from '../config';
import * as BetContractAbi from '../abis/BetABI.json';
import { betContract } from '../utils';
import { nftStakedFunc } from './getEventFunc';
import battle from '../repositories/featuredBattle';
dotenv.config();

export const installBetEvents = async () => {
    const activeBattle = await battle.getActiveBattle();

    if (activeBattle) {
        const wsProvider = new ethers.providers.WebSocketProvider(node_url.rpcUrl);
        const contract = new ethers.Contract(activeBattle.betContractAddress, BetContractAbi, wsProvider);

        contract.on('NFTStaked', async (collectionAddress, user, tokenIds) => {
            const blockNumber = await wsProvider.getBlockNumber();
            const events = await betContract.queryFilter(betContract.filters.NFTStaked(), blockNumber);

            if (events.length > 0) {
                for (const ev of events) {
                    if (ev.args) {
                        const collectionAddress = ev.args.collectionAddress;
                        const user = ev.args.user;
                        const tokenIds = ev.args.tokenIds;

                        await nftStakedFunc(collectionAddress, user, tokenIds, ev, activeBattle.betContractAddress);
                    }
                }
            }
        });

        console.log('Initialized Bet Events');
    }
};
