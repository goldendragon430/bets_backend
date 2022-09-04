import FeaturedBattle from '../models/featuredBattle';
import { ActivityType, BattleStatus, NetworkType } from '../utils/enums';
import ProjectRepository from './project';
import { rpcProvider } from '../utils';
import { setupNFTTransferJob } from '../services/cronManager';
import NftActivityModel from '../models/nftActivity';

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
        const blockNumber = await rpcProvider.getBlockNumber();
        const block = await rpcProvider.getBlock(blockNumber);

        const battles = await FeaturedBattle.find({
            startTime: { $lte: block.timestamp },
            endTime: { $gte: block.timestamp },
        });

        return battles.map((battle) => {
            return battle.id;
        });
    };

    getBattleHistories = async () => {
        const battles = await FeaturedBattle.find({ finalizeFailedCount: { $lt: 3 } });
        const histories = await Promise.all(
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
        return histories;
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
        ])

        return activities.map((activity) => {
            const projectName = activity._id.contractAddress === battle.projectL?.contract ? battle.projectL?.name : battle.projectR?.name;
            let amount = 0;
            if (activity._id.activity === ActivityType.Staked) {
                amount = activity.count
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
                action: activity._id.activity,
            }
        })
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
        const blockNumber = await rpcProvider.getBlockNumber();
        const block = await rpcProvider.getBlock(blockNumber);

        const battles = await FeaturedBattle.find({
            startTime: { $lte: block.timestamp },
            endTime: { $lte: block.timestamp },
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
            finalizeFailedCount: { $lt: 3 },
        });

        return battles.map((battle) => {
            return battle.battleId;
        });
    };

    updateBattleStatus = async (battleId: number, status: BattleStatus) => {
        return await FeaturedBattle.updateOne(
            { battleId: battleId },
            { $set: { status: status } },
        );
    }

    updateBattleFinalizeFailedCount = async (battleId: number) => {
        return await FeaturedBattle.updateOne(
            { battleId: battleId },
            { $inc: { finalizeFailedCount: 1 } },
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

        await FeaturedBattle.updateOne(
            { battleId: battleId },
            {
                $set: {
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
                }
            }
        );
    }
}

export default new FeaturedBattleRepository();
