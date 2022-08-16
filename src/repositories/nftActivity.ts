import NFTActivity from '../models/nftActivity';
import { ActivityType } from '../utils/enums';

class NFTActivityRepository {
    constructor() {}

    getNFTActivities = async () => {
        return NFTActivity.find({});
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
