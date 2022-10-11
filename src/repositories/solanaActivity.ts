import SolanaActivityModel from '../models/solanaActivity';
import { ActivityType } from '../utils/enums';
import { BN } from '@project-serum/anchor';

class SolanaActivityRepository {
    constructor() { }

    getSolanaActivity = async (signature: string) => {
        return SolanaActivityModel.findOne({ signature });
    }

    addStakedActivity = async (
        battleId: string,
        side: boolean,
        user: string,
        nftPubkey: string,
        amount: BN,
        signature: string,
        slot: number
    ) => {
        const solanaActivityInstance = new SolanaActivityModel({
            battleId,
            side,
            from: user,
            tokenId: nftPubkey,
            amount: amount.toNumber(),
            signature,
            slot,
            activity: ActivityType.Staked
        });

        return solanaActivityInstance.save();
    }

    addBettedActivity = async (
        battleId: string,
        user: string,
        amount: BN,
        side: boolean,
        signature: string,
        slot: number,
    ) => {
        const solanaActivityInstance = new SolanaActivityModel({
            battleId,
            from: user,
            amount: amount.toString(),
            side,
            amountInDecimal: amount.toNumber(),
            signature,
            slot,
            activity: ActivityType.Betted
        });

        return solanaActivityInstance.save();
    }

    getLiveFeeds = async (battle: any) => {
        const activities = await SolanaActivityModel.aggregate([
            {
                $match: {
                    battleId: battle.id.toString(),
                    activity: { $in: [ActivityType.Staked, ActivityType.Betted] },
                }
            },
            {
                $group: {
                    _id: {
                        signature: '$signature',
                        slot: '$slot'
                    },
                    side: { $first: '$side' },
                    activity: { $first: '$activity' },
                    createdAt: { $first: '$createdAt' },
                    amount: { $first: '$amount' },
                    amountInDecimal: { $first: '$amountInDecimal' },
                    from: { $first: '$from' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { createdAt: 1 } },
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
            const projectName = activity.side === false ? battle.projectL?.name : battle.projectR?.name;
            const projectDisplayName = activity.side === false ? battle.projectL?.displayName : battle.projectR?.displayName;
            let amount = 0;
            if (activity.activity === ActivityType.Staked) {
                amount = activity.count;
            } else if (activity.activity === ActivityType.Unstaked) {
                amount = 1;
            } else if (activity.activity === ActivityType.Betted) {
                amount = activity.amountInDecimal;
            }
            return {
                signature: activity._id.signature,
                user: activity.from,
                side: activity.side, // false -> ProjectL, true -> ProjectR
                timestamp: new Date(activity.createdAt).getTime(),
                amount: amount,
                teamName: projectName,
                subTeamName: projectDisplayName, // TODO: Could be removed in the future
                displayName: projectDisplayName,
                action: activity.activity,
                userInfo: activity.userInfo ? {
                    username: activity.userInfo.username,
                    address: activity.userInfo.address,
                    selectedNFT: activity.userInfo.selectedNFT,
                } : null,
            };
        });
    }
}

export default new SolanaActivityRepository();
