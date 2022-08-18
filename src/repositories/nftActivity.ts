import NFTActivity from '../models/nftActivity';
import { ActivityType } from '../utils/enums';

class NFTActivityRepository {
    constructor() {}

    getStakedStatus = async (tokenIds: Array<string>, contractAddress: string) => {
        const status: Array<{ tokenId: string, status: boolean }> = [];
        for (const tokenId of tokenIds) {
            const activity = await NFTActivity.findOne({
                tokenId,
                contractAddress,
                activityType: ActivityType.Staked
            });
            status.push({
                tokenId: tokenId,
                status: !!activity
            });
        }
        return status;
    }

    getNFTActivity = async (txHash) => {
        return NFTActivity.findOne({ transactionHash: txHash });
    }

    addNFTActivity = async(
        contractAddress: string,
        activity: ActivityType,
        from: string,
        to: string,
        tokenId: string,
        transactionHash: string,
        blockNumber: number,
    ) => {
        const nftActivityInstance = new NFTActivity({
            contractAddress,
            activity,
            from,
            to,
            tokenId,
            transactionHash,
            blockNumber
        });

        return nftActivityInstance.save();
    }
}

export default new NFTActivityRepository();
