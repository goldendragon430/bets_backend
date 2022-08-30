import cron from 'node-cron';
import BattleRepository from '../repositories/featuredBattle';
import { rpcProvider } from '../utils';
import { getBetContract } from '../utils/constants';
import { ServiceType } from '../utils/enums';
import redisHandle from '../utils/redis';
import { abpClaimedFunc, battleCreateFunc, finalizedFunc, fulfilledFunc, nftStakedFunc } from './getEventFunc';

// hash map to map keys to jobs
const jobMap: Map<string, cron.ScheduledTask> = new Map();
const jobGroupsMap: Map<string, cron.ScheduledTask[]> = new Map();

export const setupCronJobMap = async (): Promise<void> => {
    const activeBattles = await BattleRepository.getActiveBattles();

    const betContract = getBetContract();
    
    try {
        await redisHandle.init();
        redisHandle.onConnect();
        redisHandle.onError();
    } catch (e) {
        console.error('redis server connection error: ', e);
    }

    let latestBlockNumber = await rpcProvider.getBlockNumber() - 10;
    latestBlockNumber = await redisHandle.get('nftStakedBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.get('battleCreateBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.get('abpClaimedBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.get('nftTransferBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.get('fulfilledBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.get('finalizedBlock', latestBlockNumber);

    const nftStakedJob = cron.schedule('* * * * *', async () => {
        try {
            const blockNumber = await rpcProvider.getBlockNumber();

            const events = await betContract.queryFilter(
                betContract.filters.NFTStaked(),
                latestBlockNumber,
                blockNumber
            );

            if (events.length > 0) {
                for (const ev of events) {
                    if (ev.args) {
                        const battleId = ev.args.battleId;
                        const collectionAddress = ev.args.collectionAddress;
                        const user = ev.args.user;
                        const tokenIds = ev.args.tokenIds;

                        await nftStakedFunc(battleId, collectionAddress, user, tokenIds, ev, ServiceType.Cron);
                    }
                }
            }
            console.log(`${events.length} NFT Staked events found on contract ${betContract.address}`);

            latestBlockNumber = blockNumber;
            await redisHandle.set('nftStakedBlock', blockNumber);
        } catch (e) {
            console.log('getNFTStakedEvent error: ', e);
        }
    }, { scheduled: false });

    const battleCreateJob = cron.schedule('* * * * *', async () => {
        try {
            const blockNumber = await rpcProvider.getBlockNumber();

            const events = await betContract.queryFilter(
                betContract.filters.NewBattleCreated(),
                latestBlockNumber,
                blockNumber
            );

            if (events.length > 0) {
                for (const ev of events) {
                    if (ev.args) {
                        const battleId = ev.args.battleId;
                        const startTime = ev.args.startTime;
                        const endTime = ev.args.endTime;
                        const teamACollectionAddress = ev.args.teamACollectionAddress;
                        const teamBCollectionAddress = ev.args.teamBCollectionAddress;

                        await battleCreateFunc(battleId, startTime, endTime, teamACollectionAddress, teamBCollectionAddress);
                    }
                }
            }
            console.log(`${events.length} CreatedBattle events found on ${betContract.address}`);

            latestBlockNumber = blockNumber;
            await redisHandle.set('battleCreateBlock', blockNumber);
        } catch (e) {
            console.log('getBattleCreateEvents error: ', e);
        }
    }, { scheduled: false });

    const ABPClaimJob = cron.schedule('* * * * *', async () => {
        try {
            const blockNumber = await rpcProvider.getBlockNumber();

            const events = await betContract.queryFilter(
                betContract.filters.ABPClaimed(),
                latestBlockNumber,
                blockNumber
            );

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
            console.log(`${events.length} ABI Claimed events found on contract ${betContract.address}`);

            latestBlockNumber = blockNumber;
            await redisHandle.set('abpClaimedBlock', blockNumber);
        } catch (e) {
            console.log('getABPClaimedEvent error: ', e);
        }
    }, { scheduled: false });

    const FulfillJob = cron.schedule('* * * * *', async () => {
        try {
            const blockNumber = await rpcProvider.getBlockNumber();

            const events = await betContract.queryFilter(
                betContract.filters.Fulfilled(),
                latestBlockNumber,
                blockNumber
            );

            if (events.length > 0) {
                for (const ev of events) {
                    if (ev.args) {
                        const battleId = ev.args.battleId;
                        const timestamp = ev.args.timestamp;

                        await fulfilledFunc(battleId, timestamp, ev);
                    }
                }
            }
            console.log(`${events.length} Fulfilled events found on contract ${betContract.address}`);

            latestBlockNumber = blockNumber;
            await redisHandle.set('fulfilledBlock', blockNumber);
        } catch (e) {
            console.log('getFulfillEvent error: ', e);
        }
    }, { scheduled: false });

    const FinalizeJob = cron.schedule('* * * * *', async () => {
        try {
            const blockNumber = await rpcProvider.getBlockNumber();

            const events = await betContract.queryFilter(
                betContract.filters.BattleFinalized(),
                latestBlockNumber,
                blockNumber
            );

            if (events.length > 0) {
                for (const ev of events) {
                    if (ev.args) {
                        const battleId = ev.args.battleId;
                        const side = ev.args.side;
                        const chanceA = ev.args.chanceA;
                        const chanceB = ev.args.chanceB;
                        const bingo = ev.args.bingo;

                        await finalizedFunc(battleId, side, chanceA, chanceB, bingo, ev);
                    }
                }
            }
            console.log(`${events.length} Finalized events found on contract ${betContract.address}`);

            latestBlockNumber = blockNumber;
            await redisHandle.set('finalizedBlock', blockNumber);
        } catch (e) {
            console.log('getFulfillEvent error: ', e);
        }
    }, { scheduled: false });

    const requestRandomTriggerJob = cron.schedule('* * * * *', async () => {
        await BattleRepository.getBattlesByFulfill()
    }, { scheduled: false });

    const finalizeTriggerJob = cron.schedule('* * * * *', async () => {
            
    }, { scheduled: false });

    jobMap.set('nftStakedJob', nftStakedJob);
    jobMap.set('battleCreateJob', battleCreateJob);
    jobMap.set('ABPClaimJob', ABPClaimJob);
    jobMap.set('FulfillJob', FulfillJob);
    jobMap.set('FinalizeJob', FinalizeJob);
    jobMap.set('requestRandomTriggerJob', requestRandomTriggerJob);
    jobMap.set('finalizeTriggerJob', finalizeTriggerJob);
}