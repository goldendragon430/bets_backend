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
                activity: ActivityType.Staked
            });
            status.push({
                tokenId: tokenId,
                status: !!activity
            });
        }
        return status;
    }

    getActiveTotalNftStakedAmount = async (battle: any) => {
        const collectionAStakedCount = await NFTActivity.count({
            contractAddress: battle.projectL?.contract,
            activity: ActivityType.Staked
        });
        const collectionBStakedCount = await NFTActivity.count({
            contractAddress: battle.projectR?.contract,
            activity: ActivityType.Staked
        });
        const collectionAUnstakedCount = await NFTActivity.count({
            contractAddress: battle.projectL?.contract,
            activity: ActivityType.Unstaked
        });
        const collectionBUnstakedCount = await NFTActivity.count({
            contractAddress: battle.projectR?.contract,
            activity: ActivityType.Unstaked
        });

        return {
            collectionA: collectionAStakedCount - collectionAUnstakedCount,
            collectionB: collectionBStakedCount - collectionBUnstakedCount,
        };
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
