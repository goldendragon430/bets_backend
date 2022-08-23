import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { node_url } from '../config';
import * as BetContractAbi from '../abis/BetABI.json';
import { nftStakedFunc } from './getEventFunc';
import BattleRepository from '../repositories/featuredBattle';
dotenv.config();

export const installBetEvents = async () => {
    const activeBattles = await BattleRepository.getActiveBattles();

    activeBattles.map((battle) => {
        if (battle) {
            installBetEventsByAddress(battle.betContractAddress);
        }
    });
    console.log(`Initialized ${activeBattles.length} Bet Events`);
};

export const installBetEventsByAddress = (betContractAddress) => {
    const wsProvider = new ethers.providers.WebSocketProvider(node_url.rpcUrl);
    const betContract = new ethers.Contract(betContractAddress, BetContractAbi, wsProvider);

    betContract.on('NFTStaked', async (collectionAddress, user, tokenIds) => {
        const blockNumber = await wsProvider.getBlockNumber();
        const events = await betContract.queryFilter(betContract.filters.NFTStaked(), blockNumber);

        if (events.length > 0) {
            for (const ev of events) {
                if (ev.args) {
                    const collectionAddress = ev.args.collectionAddress;
                    const user = ev.args.user;
                    const tokenIds = ev.args.tokenIds;

                    await nftStakedFunc(collectionAddress, user, tokenIds, ev, betContractAddress);
                }
            }
        }
    });

    console.log('Initialized NFTStaked Event on ', betContractAddress);
};
