import * as cron from 'node-cron';
import BattleRepository from '../repositories/featuredBattle';
import ProjectRepository from '../repositories/project';
import { BetContract, adminSigner, getERC721Contract, provider } from '../utils/constants';
import { ServiceType, BattleStatus, NetworkType } from '../utils/enums';
import redisHandle from '../utils/redis';
import { abpClaimedFunc, battleCreateFunc, bettedFunc, finalizedFunc, fulfilledFunc, nftStakedFunc, nftTransferFunc, syncProjectFromOpensea } from './getEventFunc';

// hash map to map keys to jobs
const jobMap: Map<string, cron.ScheduledTask> = new Map();

export const setupCronJobMap = async (): Promise<void> => {
    try {
        await redisHandle.init();
        redisHandle.onConnect();
        redisHandle.onError();
    } catch (e) {
        console.error('redis server connection error: ', e);
    }

    let latestBlockNumber = await provider.getBlockNumber() - 10;

    latestBlockNumber = await redisHandle.initVaule('nftStakedBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.initVaule('bettedJobBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.initVaule('battleCreateBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.initVaule('abpClaimedBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.initVaule('nftTransferBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.initVaule('fulfilledBlock', latestBlockNumber);
    latestBlockNumber = await redisHandle.initVaule('finalizedBlock', latestBlockNumber);

    const nftStakedJob = cron.schedule('1-59/5 * * * *', async () => {
        try {
            const nftStakedBlockNumber = await redisHandle.get('nftStakedBlock');

            const blockNumber = await provider.getBlockNumber();

            const events = await BetContract.queryFilter(
                BetContract.filters.NFTStaked(),
                nftStakedBlockNumber,
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
            console.log(`${events.length} NFT Staked events found on contract ${BetContract.address}`);

            await redisHandle.set('nftStakedBlock', blockNumber);
        } catch (e) {
            console.log('getNFTStakedEvent error: ', e);
        }
    }, { scheduled: false }).start();

    const bettedJob = cron.schedule('2-59/5 * * * *', async () => {
        try {
            const bettedBlockNumber = await redisHandle.get('bettedJobBlock');

            const blockNumber = await provider.getBlockNumber();

            const events = await BetContract.queryFilter(
                BetContract.filters.Betted(),
                bettedBlockNumber,
                blockNumber
            );

            if (events.length > 0) {
                for (const ev of events) {
                    if (ev.args) {
                        const battleId = ev.args.battleId;
                        const user = ev.args.user;
                        const amount = ev.args.amount;
                        const side = ev.args.side;

                        await bettedFunc(battleId, user, amount, side, ev);
                    }
                }
            }
            console.log(`${events.length} Betted events found on contract ${BetContract.address}`);

            await redisHandle.set('bettedJobBlock', blockNumber);
        } catch (e) {
            console.log('getBettedEvent error: ', e);
        }
    }, { scheduled: false }).start();

    const battleCreateJob = cron.schedule('3-59/5 * * * *', async () => {
        try {
            const battleCreateBlockNumber = await redisHandle.get('battleCreateBlock');
            const blockNumber = await provider.getBlockNumber();

            const events = await BetContract.queryFilter(
                BetContract.filters.NewBattleCreated(),
                battleCreateBlockNumber,
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
            console.log(`${events.length} CreatedBattle events found on ${BetContract.address}`);

            await redisHandle.set('battleCreateBlock', blockNumber);
        } catch (e) {
            console.log('getBattleCreateEvents error: ', e);
        }
    }, { scheduled: false }).start();

    const ABPClaimJob = cron.schedule('4-59/5 * * * *', async () => {
        try {
            const abpClaimedBlockNumber = await redisHandle.get('abpClaimedBlock');
            const blockNumber = await provider.getBlockNumber();

            const events = await BetContract.queryFilter(
                BetContract.filters.ABPClaimed(),
                abpClaimedBlockNumber,
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
            console.log(`${events.length} ABP Claimed events found on contract ${BetContract.address}`);

            await redisHandle.set('abpClaimedBlock', blockNumber);
        } catch (e) {
            console.log('getABPClaimedEvent error: ', e);
        }
    }, { scheduled: false }).start();

    const FulfillJob = cron.schedule('*/5 * * * *', async () => {
        try {
            const fulfilledBlockNumber = await redisHandle.get('fulfilledBlock');
            const blockNumber = await provider.getBlockNumber();

            const events = await BetContract.queryFilter(
                BetContract.filters.Fulfilled(),
                fulfilledBlockNumber,
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
            console.log(`${events.length} Fulfilled events found on contract ${BetContract.address}`);

            await redisHandle.set('fulfilledBlock', blockNumber);
        } catch (e) {
            console.log('getFulfillEvent error: ', e);
        }
    }, { scheduled: false }).start();

    const FinalizeJob = cron.schedule('*/5 * * * *', async () => {
        try {
            const finalizedBlockBlockNumber = await redisHandle.get('finalizedBlock');
            const blockNumber = await provider.getBlockNumber();

            const events = await BetContract.queryFilter(
                BetContract.filters.BattleFinalized(),
                finalizedBlockBlockNumber,
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
            console.log(`${events.length} Finalized events found on contract ${BetContract.address}`);

            await redisHandle.set('finalizedBlock', blockNumber);
        } catch (e) {
            console.log('getFulfillEvent error: ', e);
        }
    }, { scheduled: false }).start();

    const requestRandomTriggerJob = cron.schedule('*/2 * * * *', async () => {
        const battleIds = await BattleRepository.getBattlesByCreated();
        console.log(battleIds);

        for (const battleId of battleIds) {
            try {
                try {
                    const { projectL, projectR } = await BattleRepository.getUnstakeInfos(battleId as number);
                    if (projectL.users.length > 0) {
                        const unstakeTx = await BetContract.connect(adminSigner).unstakeNftFromUser(battleId, projectL.side, projectL.users, projectL.tokenIds, projectL.userTokenIdLengths);
                        await unstakeTx.wait();
                    }
                    if (projectR.users.length > 0) {
                        const unstakeTx = await BetContract.connect(adminSigner).unstakeNftFromUser(battleId, projectR.side, projectR.users, projectR.tokenIds, projectR.userTokenIdLengths);
                        await unstakeTx.wait();
                    }
                } catch (e1) {
                    console.error(`Error while unstaking for battle ID ${battleId}`);
                }
                const tx = await BetContract.connect(adminSigner).requestRandomWords(battleId);
                await tx.wait();
                console.log(`In ${battleId} battle requested random words in attached transaction Hash`, tx.hash);
                await BattleRepository.updateBattleStatus(battleId as number, BattleStatus.RequestRandomWords);
            } catch (e) {
                console.log(e);
                console.error(`Error while requesting random words for battle ID ${battleId}`);
            }
        }
    }, { scheduled: false }).start();

    const finalizeTriggerJob = cron.schedule('1-59/2 * * * *', async () => {
        const battleIds = await BattleRepository.getBattlesByFulfill();
        console.log(battleIds);

        for (const battleId of battleIds) {
            try {
                const tx = await BetContract.connect(adminSigner).finalizeBattle(battleId);
                await tx.wait();
                console.log(`In ${battleId} battle finalized in attached transaction Hash`, tx.hash);
                await BattleRepository.resetBattleFinalizeFailedCount(battleId as number);
            } catch (e) {
                await BattleRepository.updateBattleFinalizeFailedCount(battleId as number);
                console.error(`Error while finalizing for battle ID ${battleId}`);
            }
        }
    }, { scheduled: false }).start();

    const sleep = () => {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    };

    const requestOpenseaJob = cron.schedule('0 0 * * *', async () => {
        const projects = await ProjectRepository.getProjects(NetworkType.ETH);
        for (const project of projects) {
            if (project.slug) {
                try {
                    await syncProjectFromOpensea(project.slug);
                    console.log(`Synced ${project.slug}`);
                } catch (e) {
                    console.log(`While syncing ${project.slug} got error: ${e}`);
                }
                await sleep();
            }
        }
    }, { scheduled: false }).start();

    jobMap.set('nftStakedJob', nftStakedJob);
    jobMap.set('bettedJob', bettedJob);
    jobMap.set('battleCreateJob', battleCreateJob);
    jobMap.set('ABPClaimJob', ABPClaimJob);
    jobMap.set('FulfillJob', FulfillJob);
    jobMap.set('FinalizeJob', FinalizeJob);
    jobMap.set('requestRandomTriggerJob', requestRandomTriggerJob);
    jobMap.set('finalizeTriggerJob', finalizeTriggerJob);
    jobMap.set('requestOpenseaJob', requestOpenseaJob);

    const activeBattles = await BattleRepository.getActiveBattles();
    activeBattles.map(async (activeBattle) => {
        if (activeBattle) {
            setupNFTTransferJob(activeBattle.projectL?.contract || '');
            setupNFTTransferJob(activeBattle.projectR?.contract || '');
        }
    });
};

export const setupNFTTransferJob = (nftAddress: string) => {
    if (nftAddress === '' || jobMap.has(nftAddress)) {
        return;
    }

    const nftTransferJob = cron.schedule('* * * * *', async () => {
        try {
            const nftTransferBlockNumber = await redisHandle.get('nftTransferBlock');
            const blockNumber = await provider.getBlockNumber();

            const nftContract = getERC721Contract(nftAddress);
            const events = await nftContract.queryFilter(
                nftContract.filters.Transfer(),
                nftTransferBlockNumber,
                blockNumber
            );

            if (events.length > 0) {
                for (const ev of events) {
                    if (ev.args) {
                        const from = ev.args.from;
                        const to = ev.args.to;
                        const tokenId = ev.args.tokenId;

                        await nftTransferFunc(nftAddress, from, to, tokenId, ev, ServiceType.Cron);
                    }
                }
            }
            console.log(`${events.length} NFT Transfer events found on contract ${nftAddress}`);

            await redisHandle.set('nftTransferBlock', blockNumber);
        } catch (e) {
            console.log('getNFTTransferEvent error: ', e);
        }
    }, { scheduled: false }).start();

    jobMap.set(nftAddress, nftTransferJob);
};
