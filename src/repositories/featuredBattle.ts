import FeaturedBattle from '../models/featuredBattle';
import { ActivityType, BattleStatus, NetworkType } from '../utils/enums';
import ProjectRepository from './project';
import { setupNFTTransferJob } from '../services/cronManager';
import NftActivityModel from '../models/nftActivity';
import SolanaActivityModel from '../models/solanaActivity';
import { BigNumber } from 'ethers';
import { startBet } from '../utils/solana';

class FeaturedBattleRepository {
    constructor() {
    }

    getBattleByQuery = async (where: any) => {
        return FeaturedBattle.findOne(where);
    }

    getBattle = async (battle_id): Promise<any> => {
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
        const battle = await FeaturedBattle.findOne({ battleId, network: NetworkType.ETH });
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

    getActiveBattleIds = async (network: NetworkType) => {
        const now = new Date().getTime();
        const currentTimestamp = Math.floor(now / 1000);

        const battles = await FeaturedBattle.find({
            network: network,
            startTime: { $lte: currentTimestamp },
            endTime: { $gte: currentTimestamp },
        });

        return battles.map((battle) => {
            return battle.id;
        });
    };

    getBattleIdsByStatus = async () => {
        const now = new Date().getTime();
        const currentTimestamp = Math.floor(now / 1000);

        const battles = await FeaturedBattle.find({
            network: NetworkType.ETH,
            startTime: { $lte: currentTimestamp },
            endTime: { $gte: currentTimestamp },
        });

        return battles.map((battle) => {
            return battle.battleId;
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
                        blockNumber: '$blockNumber'
                    },
                    side: { $first: '$side' },
                    contractAddress: { $first: '$contractAddress' },
                    activity: { $first: '$activity' },
                    createdAt: { $first: '$createdAt' },
                    amount: { $first: '$amount' },
                    amountInDecimal: { $first: '$amountInDecimal' },
                    from: { $first: '$from' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.blockNumber': 1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: 'address',
                    as: 'userInfo',
                }
            },
            {
                $unwind: {
                    path: '$userInfo',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        return activities.map((activity) => {
            const projectName = activity.contractAddress === battle.projectL?.contract ? battle.projectL?.name : battle.projectR?.name;
            const projectSubName = activity.contractAddress === battle.projectL?.contract ? battle.projectL?.subName : battle.projectR?.subName;
            let amount = 0;
            if (activity.activity === ActivityType.Staked) {
                amount = activity.count;
            } else if (activity.activity === ActivityType.Unstaked) {
                amount = 1;
            } else if (activity.activity === ActivityType.Betted) {
                amount = activity.amountInDecimal;
            }
            return {
                txHash: activity._id.transactionHash,
                user: activity.from,
                side: activity.side, // false -> ProjectL, true -> ProjectR
                timestamp: new Date(activity.createdAt).getTime(),
                amount: amount,
                teamName: projectName,
                subTeamName: projectSubName,
                action: activity.activity,
                userInfo: activity.userInfo,
            };
        });
    }

    getActiveBattles = async () => {
        const battleIds = await this.getActiveBattleIds(NetworkType.ETH);
        return await Promise.all(
            battleIds.map(async (battleId) => {
                return await this.getBattle(battleId);
            })
        );
    };

    getBattlesByCreated = async () => {
        const now = new Date().getTime();
        const currentTimestamp = Math.floor(now / 1000);

        const battles = await FeaturedBattle.find({
            startTime: { $lte: currentTimestamp },
            endTime: { $lte: currentTimestamp },
            network: NetworkType.ETH,
            $and: [
                { status: BattleStatus.Created },
                { status: { $ne: BattleStatus.RequestRandomWords }, },
                { status: { $ne: BattleStatus.RefundSet }, }
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

    updateBattleStatus = async (battleId: number, status: BattleStatus, network: NetworkType = NetworkType.ETH) => {
        return FeaturedBattle.updateOne(
            { battleId: battleId, network: network },
            { $set: { status: status } },
        );
    }

    updateBattleStatusById = async (id: string, status: BattleStatus, network: NetworkType = NetworkType.ETH) => {
        return FeaturedBattle.updateOne(
            { _id: id, network: network },
            { $set: { status: status } },
        );
    }

    updateBattleFinalizeFailedCount = async (battleId: number) => {
        return FeaturedBattle.updateOne(
            { battleId: battleId, network: NetworkType.ETH },
            { $inc: { finalizeFailedCount: 1 } },
        );
    }

    resetBattleFinalizeFailedCount = async (battleId: number) => {
        return FeaturedBattle.updateOne(
            { battleId: battleId, network: NetworkType.ETH },
            { finalizeFailedCount: 0 },
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
            network: NetworkType.ETH,
            finalizeFailedCount: 0,
            projectL: projectL,
            projectR: projectR,
        };
        if (twitterID) {
            updateData = Object.assign(updateData, { twitterAnnounceID: twitterID });
        }

        await FeaturedBattle.updateOne(
            { battleId: battleId, network: NetworkType.ETH },
            {
                $set: updateData
            }
        );
    }

    addSolanaBattle = async (startTime: number, endTime: number, projectL_id: string, projectR_id: string, twitterID: string): Promise<any> => {
        const projectL = await ProjectRepository.getProject(projectL_id);
        const projectR = await ProjectRepository.getProject(projectR_id);

        if (!projectL || !projectR) {
            throw new Error('Project not found');
        }
        if (!projectL.creator || !projectR.creator) {
            throw new Error('Creator address not found');
        }

        const solBattles: Array<any> = await FeaturedBattle.find({ network: NetworkType.SOL }).limit(1).sort({ _id: -1 });
        const battle: any = await FeaturedBattle.create({
            startDate: new Date(startTime * 1000),
            battleId: solBattles.length > 0 ? solBattles[0].battleId + 1 : 1,
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

        await startBet(battle.battleId.toString(), startTime, endTime, projectL?.creator, projectR?.creator);
        return battle;
    }

    deleteSolanaBattle = async (battleId: string): Promise<any> => {
        return FeaturedBattle.deleteOne({
            network: NetworkType.SOL,
            _id: battleId
        });
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

    getBattlesByStatus = async (status: BattleStatus, network: NetworkType): Promise<Array<any>> => {
        return FeaturedBattle.find({
            status: status,
            network: network
        });
    }

    getSolanaEndedBattles = async (): Promise<Array<string>> => {
        const battles = await this.getBattlesByStatus(BattleStatus.Created, NetworkType.SOL);
        const timestamp = (new Date().getTime()) / 1000;
        const battleIds: Array<string> = [];
        for (const battle of battles) {
            if (battle.endTime < (timestamp + 15000)) {
                battleIds.push(battle._id.toString());
            }
        }
        return battleIds;
    }

    getProgressBattleCountByAddress = async (address: string): Promise<number> => {
        const battleIds = await this.getBattleIdsByStatus();
        const activity = await NftActivityModel.aggregate([
            {
                $match: {
                    battleId: {$in: battleIds},
                    from: address
                }
            },
            {
                '$group' : {
                    _id: '$battleId',
                    count: {$sum: 1}
                }
            }
        ]);
        return activity ? activity.length : 0;
    }

    getProgressBattleCountByAddressAndSol = async (address: string): Promise<number> => {
        const battleIds = await this.getBattleIdsByStatus();
        const solActivity = await SolanaActivityModel.aggregate([
            {
                $match: {
                    battleId: {$in: battleIds},
                    from: address
                }
            },
            {
                '$group' : {
                    _id: '$battleId',
                    count: {$sum: 1}
                }
            }
        ]);

        return solActivity ? solActivity.length : 0;
    }
}

export default new FeaturedBattleRepository();
