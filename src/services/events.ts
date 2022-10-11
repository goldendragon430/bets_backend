import { nftStakedFunc, battleCreateFunc, bettedFunc, fulfilledFunc, finalizedFunc, refundFunc, rewardClaimedFunc } from './getEventFunc';
import { RewardType, ServiceType } from '../utils/enums';
import { BetContract, provider } from '../utils/constants';

export const installBetEvents = () => {
    const contract = BetContract;

    contract.on('NFTStaked', async (battleId, side, user, tokenIds) => {
        const blockNumber = await provider.getBlockNumber();
        const events = await contract.queryFilter(contract.filters.NFTStaked(), (blockNumber - 10));

        if (events.length > 0) {
            for (const ev of events) {
                if (ev.args) {
                    const battleId = ev.args.battleId;
                    const side = ev.args.side;
                    const user = ev.args.user;
                    const tokenIds = ev.args.tokenIds;

                    await nftStakedFunc(battleId, side, user, tokenIds, ev, ServiceType.Contract);
                }
            }
        }
    });

    // contract.on('NewBattleCreated', async (battleId, startTime, endTime, teamACollectionAddress, teamBCollectionAddress) => {
    //     await battleCreateFunc(battleId, startTime, endTime, teamACollectionAddress, teamBCollectionAddress);
    // });

    contract.on('ABPClaimed', async (battleId, user, amount) => {
        const blockNumber = await provider.getBlockNumber();
        const events = await contract.queryFilter(contract.filters.ABPClaimed(), (blockNumber - 10));

        if (events.length > 0) {
            for (const ev of events) {
                if (ev.args) {
                    const battleId = ev.args.battleId;
                    const user = ev.args.user;
                    const amount = ev.args.amount;

                    await rewardClaimedFunc(battleId, user, amount, RewardType.ABP, ev);
                }
            }
        }
    });

    contract.on('RewardClaimed', async (battleId, user, amount) => {
        const blockNumber = await provider.getBlockNumber();
        const events = await contract.queryFilter(contract.filters.RewardClaimed(), (blockNumber - 10));

        if (events.length > 0) {
            for (const ev of events) {
                if (ev.args) {
                    const battleId = ev.args.battleId;
                    const user = ev.args.user;
                    const amount = ev.args.amount;

                    await rewardClaimedFunc(battleId, user, amount, RewardType.ETH, ev);
                }
            }
        }
    });

    contract.on('Fulfilled', async (battleId, timestamp) => {
        const blockNumber = await provider.getBlockNumber();
        const events = await contract.queryFilter(contract.filters.Fulfilled(), (blockNumber - 10));

        if (events.length > 0) {
            for (const ev of events) {
                if (ev.args) {
                    const battleId = ev.args.battleId;
                    const timestamp = ev.args.timestamp;

                    await fulfilledFunc(battleId, timestamp, ev);
                }
            }
        }
    });

    contract.on('BattleFinalized', async (battleId, timestamp) => {
        const blockNumber = await provider.getBlockNumber();
        const events = await contract.queryFilter(contract.filters.BattleFinalized(), (blockNumber - 10));

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
    });

    contract.on('Betted', async (battleId, user, amount, side) => {
        const blockNumber = await provider.getBlockNumber();
        const events = await contract.queryFilter(contract.filters.Betted(), (blockNumber - 10));

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
    });

    contract.on('RefundSet', async (battleId, flag) => {
        const blockNumber = await provider.getBlockNumber();
        const events = await contract.queryFilter(contract.filters.RefundSet(), (blockNumber - 10));

        if (events.length > 0) {
            for (const ev of events) {
                if (ev.args) {
                    const battleId = ev.args.battleId;
                    const flag = ev.args.flag;

                    await refundFunc(battleId, flag, ev);
                }
            }
        }
    });

    console.log('Initialized All events on ', contract.address);
};
