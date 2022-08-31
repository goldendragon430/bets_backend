import * as dotenv from 'dotenv';
import { nftStakedFunc, battleCreateFunc, abpClaimedFunc } from './getEventFunc';
import { ServiceType } from '../utils/enums';
import { BetContract, provider } from '../utils/constants';
dotenv.config();

export const installNFTStakedEvents = async () => {
    const contract = BetContract;

    contract.on('NFTStaked', async (battleId, collectionAddress, user, tokenIds) => {
        const blockNumber = await provider.getBlockNumber();
        const events = await contract.queryFilter(contract.filters.NFTStaked(), (blockNumber - 10));

        if (events.length > 0) {
            for (const ev of events) {
                if (ev.args) {
                    const battleId = ev.args.battleId;
                    const collectionAddress = ev.args.collectionAddress;
                    const user = ev.args.user;
                    const tokenIds = ev.args.tokenIds;

                    await nftStakedFunc(battleId, collectionAddress, user, tokenIds, ev, ServiceType.Contract);
                }
            }
        }
    });

    contract.on('NewBattleCreated', async (battleId, startTime, endTime, teamACollectionAddress, teamBCollectionAddress) => {
        await battleCreateFunc(battleId, startTime, endTime, teamACollectionAddress, teamBCollectionAddress);
    });

    contract.on('ABPClaimed', async (battleId, user, amount) => {
        const blockNumber = await provider.getBlockNumber();
        const events = await contract.queryFilter(contract.filters.ABPClaimed(), (blockNumber - 10));

        if (events.length > 0) {
            for (const ev of events) {
                if (ev.args) {
                    const battleId = ev.args.battleId;
                    const user = ev.args.user;
                    const amount = ev.args.amount;

                    await abpClaimedFunc(battleId, user, amount, ev);
                }
            }
        }
    });

    console.log('Initialized NFTStaked Event on ', contract.address);
};
