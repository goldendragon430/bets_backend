import { BigNumber, ethers } from 'ethers';
import { RewardType } from '../utils/enums';
import ClaimActivity from '../models/claimActivity';

class ClaimActivityRepository {
    constructor() { }

    getLeaderboard = async () => {
        const activities = await ClaimActivity.aggregate(
            [
                {
                    $group: {
                        _id: '$user',
                        battleId: { $last: '$battleId' },
                        sumA: { $sum: '$amountInDecimal' }
                    }
                },
                { $sort: { sumA: -1 } }
            ]
        );
        const leaderboard = activities.map(activity => {
            return {
                user: activity._id,
                battleId: activity.battleId,
                amount: activity.sumA
            };
        }).sort((a, b) => {
            return b.amount - a.amount;
        });
        return leaderboard;
    }

    getClaimActivity = async (txHash: string) => {
        return ClaimActivity.findOne({ transactionHash: txHash });
    }

    addClaimActivity = async (
        battleId: number,
        user: string,
        amount: BigNumber,
        rewardType: RewardType,
        transactionHash: string,
        blockNumber: number,
    ) => {
        const claimActivityInstance = new ClaimActivity({
            battleId,
            user,
            amount: amount.toString(),
            rewardType,
            amountInDecimal: parseFloat(ethers.utils.formatEther(amount)),
            transactionHash,
            blockNumber,
        });

        return claimActivityInstance.save();
    }
}

export default new ClaimActivityRepository();
