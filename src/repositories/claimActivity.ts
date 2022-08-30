import { BigNumber, ethers } from 'ethers';
import ClaimActivity from '../models/claimActivity';

class ClaimActivityRepository {
    constructor() { }

    getLeaderboard = async () => {
        const activities = await ClaimActivity.find();
        const leaderboard = activities.map(activity => {
            return {
                battleId: activity.battleId,
                user: activity.user,
                amount: activity.amountInDecimal
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
        transactionHash: string,
        blockNumber: number,
    ) => {
        const claimActivityInstance = new ClaimActivity({
            battleId,
            user,
            amount: amount.toString(),
            amountInDecimal: parseFloat(ethers.utils.formatEther(amount)),
            transactionHash,
            blockNumber,
        });

        return claimActivityInstance.save();
    }
}

export default new ClaimActivityRepository();
