import FeaturedBattle from '../models/featuredBattle';
import { ActivityType, BattleStatus, NetworkType } from '../utils/enums';
import ProjectRepository from './project';
import { provider } from '../utils/constants';
import { setupNFTTransferJob } from '../services/cronManager';
import NftActivityModel from '../models/nftActivity';
import { BigNumber } from 'ethers';
import { startBet } from '../utils/solana';

class FeaturedBattleRepository {
    constructor() {
    }

    getFeaturedBattles = async () => {
        return FeaturedBattle.find({});
    };

    getBattleByQuery = async (where: any) => {
        return FeaturedBattle.findOne(where);
    }

    getBattle = async (battle_id) => {
        const battle = await FeaturedBattle.findById(battle_id);
        if (!battle) {
            return undefined;
        }
        const projectL = await ProjectRepository.getProjectById(battle.projectL);
        const projectR = await ProjectRepository.getProjectById(battle.projectR);
        return Object.assign(battle.toJSON(), {
            id: battle.id,
            projectL: projectL?.toJSON(),
            projectR: projectR?.toJSON(),
        });
    };

    getBattleByBattleId = async (battleId: number) => {
        const battle = await FeaturedBattle.findOne({ battleId });
        if (!battle) {
            return undefined;
        }
        const projectL = await ProjectRepository.getProjectById(battle.projectL);
        const projectR = await ProjectRepository.getProjectById(battle.projectR);
        return Object.assign(battle.toJSON(), {
            id: battle.id,
            projectL: projectL?.toJSON(),
            projectR: projectR?.toJSON(),
        });
    };

    getActiveBattleIds = async () => {
        const blockNumber = await provider.getBlockNumber();
        const block = await provider.getBlock(blockNumber);

        const battles = await FeaturedBattle.find({
            startTime: { $lte: block.timestamp },
            endTime: { $gte: block.timestamp },
        });

        return battles.map((battle) => {
            return battle.id;
        });
    };

    getBattleHistories = async (network: NetworkType) => {
        const battles = await FeaturedBattle.find(
            {
                finalizeFailedCount: { $lt: 3 },
                network: network
            },
        );

        return await Promise.all(
            battles.map(async (item) => {
                const projectL = await ProjectRepository.getProjectById(item?.projectL);
                const projectR = await ProjectRepository.getProjectById(item?.projectR);
                return Object.assign(item.toJSON(), {
                    id: item.id,
                    projectL: projectL?.toJSON(),
                    projectR: projectR?.toJSON(),
                });
            })
        );
    };

    getBattleEvents = async (battle_id: number) => {
        const battle = await this.getBattleByBattleId(battle_id);
        if (!battle) {
            return [];
        }
        const activities = await NftActivityModel.aggregate([
            {
                $match: {
                    battleId: battle_id,
                    activity: { $in: [ActivityType.Staked, ActivityType.Unstaked, ActivityType.Betted] },
                }
            },
            {
                $group: {
                    _id: {
                        transactionHash: '$transactionHash',
                        blockNumber: '$blockNumber',
                        contractAddress: '$contractAddress',
                        activity: '$activity',
                        amount: '$amountInDecimal',
                        from: '$from'
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.blockNumber': 1 } }
        ]);

        return activities.map((activity) => {
            const projectName = activity._id.contractAddress === battle.projectL?.contract ? battle.projectL?.name : battle.projectR?.name;
            const projectSubName = activity._id.contractAddress === battle.projectL?.contract ? battle.projectL?.subName : battle.projectR?.subName;
            let amount = 0;
            if (activity._id.activity === ActivityType.Staked) {
                amount = activity.count;
            } else if (activity._id.activity === ActivityType.Unstaked) {
                amount = 1;
            } else if (activity._id.activity === ActivityType.Betted) {
                amount = activity._id.amount;
            }
            return {
                txHash: activity._id.transactionHash,
                user: activity._id.from,
                amount: amount,
                teamName: projectName,
                subTeamName: projectSubName,
                action: activity._id.activity,
            };
        });
    }

    getActiveBattles = async () => {
        const battleIds = await this.getActiveBattleIds();
        return await Promise.all(
            battleIds.map(async (battleId) => {
                return await this.getBattle(battleId);
            })
        );
    };

    getBattlesByCreated = async () => {
        const blockNumber = await provider.getBlockNumber();
        const block = await provider.getBlock(blockNumber);

        const battles = await FeaturedBattle.find({
            startTime: { $lte: block.timestamp },
            endTime: { $lte: block.timestamp },
            network: NetworkType.ETH,
            $and: [
                { status: BattleStatus.Created },
                { status: { $ne: BattleStatus.RequestRandomWords }, }
            ],
        });

        return battles.map((battle) => {
            return battle.battleId;
        });
    };

    getBattlesByFulfill = async () => {
        const battles = await FeaturedBattle.find({
            status: BattleStatus.Fulfilled,
            network: NetworkType.ETH,
            finalizeFailedCount: { $lt: 3 },
        });

        return battles.map((battle) => {
            return battle.battleId;
        });
    };

    updateBattleStatus = async (battleId: number, status: BattleStatus) => {
        return FeaturedBattle.updateOne(
            {battleId: battleId},
            {$set: {status: status}},
        );
    }

    updateBattleFinalizeFailedCount = async (battleId: number) => {
        return FeaturedBattle.updateOne(
            {battleId: battleId},
            {$inc: {finalizeFailedCount: 1}},
        );
    }

    resetBattleFinalizeFailedCount = async (battleId: number) => {
        return FeaturedBattle.updateOne(
            {battleId: battleId},
            {finalizeFailedCount: 0},
        );
    }

    addBattle = async (battleId: number, startTime: number, endTime: number, projectLContract: string, projectRContract: string, twitterID: string | undefined) => {
        const projectL = await ProjectRepository.getProjectByContract(projectLContract);
        const projectR = await ProjectRepository.getProjectByContract(projectRContract);

        setupNFTTransferJob(projectLContract);
        setupNFTTransferJob(projectRContract);

        const battleLength = endTime - startTime;

        await FeaturedBattle.create({
            startDate: new Date(startTime * 1000),
            battleId: battleId,
            startTime: startTime,
            endTime: endTime,
            battleLength: battleLength,
            status: BattleStatus.Created,
            network: NetworkType.ETH,
            finalizeFailedCount: 0,
            projectL: projectL,
            projectR: projectR,
            twitterAnnounceID: twitterID,
        });
    }

    addSolanaBattle = async (startTime: number, endTime: number, projectL_id: string, projectR_id: string, twitterID: string): Promise<number> => {
        const projectL = await ProjectRepository.getProject(projectL_id);
        const projectR = await ProjectRepository.getProject(projectR_id);

        if (!projectL || !projectR) {
            throw new Error('Project not found');
        }

        const solBattleCount = await FeaturedBattle.count({ network: NetworkType.SOL });
        const battle = await FeaturedBattle.create({
            startDate: new Date(startTime * 1000),
            battleId: solBattleCount + 1,
            startTime: startTime,
            endTime: endTime,
            battleLength: endTime - startTime,
            status: BattleStatus.Created,
            network: NetworkType.SOL,
            finalizeFailedCount: 0,
            projectL: projectL,
            projectR: projectR,
            twitterAnnounceID: twitterID,
        });

        await startBet(startTime, endTime, projectL?.contract, projectR?.contract, battle.battleId.toString());
        return battle.battleId;
    }

    updateBattle = async (battleId: number, startTime: number, endTime: number, projectLContract: string, projectRContract: string, twitterID: string | undefined) => {
        const projectL = await ProjectRepository.getProjectByContract(projectLContract);
        const projectR = await ProjectRepository.getProjectByContract(projectRContract);

        setupNFTTransferJob(projectLContract);
        setupNFTTransferJob(projectRContract);

        const battleLength = endTime - startTime;

        let updateData = {
            startDate: new Date(startTime * 1000),
            battleId: battleId,
            startTime: startTime,
            endTime: endTime,
            battleLength: battleLength,
            status: BattleStatus.Created,
            network: NetworkType.ETH,
            finalizeFailedCount: 0,
            projectL: projectL,
            projectR: projectR,
        };
        if (twitterID) {
            updateData = Object.assign(updateData, { twitterAnnounceID: twitterID });
        }

        await FeaturedBattle.updateOne(
            { battleId: battleId },
            {
                $set: updateData
            }
        );
    }

    // false -> ProjectL, true -> ProjectR
    getUnstakeInfos = async (battleId: number) => {
        const battle = await this.getBattleByBattleId(battleId);
        if (!battle) {
            return {
                projectL: {
                    side: false,
                    users: [],
                    tokenIds: [],
                    userTokenIdLengths: []
                },
                projectR: {
                    side: true,
                    users: [],
                    tokenIds: [],
                    userTokenIdLengths: []
                }
            };
        }
        const projectLActivities = await NftActivityModel.find({
            battleId: battleId,
            activity: ActivityType.Unstaked,
            contractAddress: battle.projectL?.contract,
        });


        const userInfoL: any = {};
        for (const activity of projectLActivities) {
            const userAddress = activity.from;
            if (userAddress) {
                if (userInfoL[userAddress]) {
                    userInfoL[userAddress].tokenIds.push(BigNumber.from(activity.tokenId));
                } else {
                    userInfoL[userAddress] = {
                        tokenIds: []
                    };
                    userInfoL[userAddress].tokenIds.push(BigNumber.from(activity.tokenId));
                }
            }
        }

        let tokenIdsL = [];
        let tokenLengthL = [];
        Object.keys(userInfoL).map((userAddress) => {
            console.log(userInfoL[userAddress]);
            tokenIdsL = tokenIdsL.concat(userInfoL[userAddress].tokenIds);
            tokenLengthL = tokenLengthL.concat(userInfoL[userAddress].tokenIds.length);
            return userInfoL[userAddress].tokenIds;
        });

        const projectRActivities = await NftActivityModel.find({
            battleId: battleId,
            activity: ActivityType.Unstaked,
            contractAddress: battle.projectR?.contract,
        });

        const userInfoR: any = {};
        for (const activity of projectRActivities) {
            const userAddress = activity.from;
            if (userAddress) {
                if (userInfoR[userAddress]) {
                    userInfoR[userAddress].tokenIds.push(BigNumber.from(activity.tokenId));
                } else {
                    userInfoR[userAddress] = {
                        tokenIds: []
                    };
                    userInfoR[userAddress].tokenIds.push(BigNumber.from(activity.tokenId));
                }
            }
        }
        let tokenIdsR = [];
        let tokenLengthR = [];
        Object.keys(userInfoR).map((userAddress) => {
            tokenIdsR = tokenIdsR.concat(userInfoR[userAddress].tokenIds);
            tokenLengthR = tokenLengthR.concat(userInfoR[userAddress].tokenIds.length);
            return userInfoR[userAddress].tokenIds;
        });

        return {
            projectL: {
                side: false,
                users: Object.keys(userInfoL),
                tokenIds: tokenIdsL,
                userTokenIdLengths: tokenLengthL
            },
            projectR: {
                side: true,
                users: Object.keys(userInfoR),
                tokenIds: tokenIdsR,
                userTokenIdLengths: tokenLengthR
            }
        };
    }
}

export default new FeaturedBattleRepository();
