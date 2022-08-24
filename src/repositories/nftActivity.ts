import NFTActivity from '../models/nftActivity';
import { ActivityType } from '../utils/enums';

class NFTActivityRepository {
    constructor() { }

    getStakedStatus = async (tokenIds: Array<string>, contractAddress: string, betContractAddress: string) => {
        const status: Array<{ tokenId: string, status: boolean }> = [];
        for (const tokenId of tokenIds) {
            const activity = await NFTActivity.findOne({
                tokenId,
                contractAddress,
                betContractAddress,
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
            betContractAddress: battle.betContractAddress,
            activity: ActivityType.Staked
        });
        const collectionBStakedCount = await NFTActivity.count({
            contractAddress: battle.projectR?.contract,
            betContractAddress: battle.betContractAddress,
            activity: ActivityType.Staked
        });
        const collectionAUnstakedCount = await NFTActivity.count({
            contractAddress: battle.projectL?.contract,
            betContractAddress: battle.betContractAddress,
            activity: ActivityType.Unstaked
        });
        const collectionBUnstakedCount = await NFTActivity.count({
            contractAddress: battle.projectR?.contract,
            betContractAddress: battle.betContractAddress,
            activity: ActivityType.Unstaked
        });

        return {
            collectionA: collectionAStakedCount - collectionAUnstakedCount,
            collectionB: collectionBStakedCount - collectionBUnstakedCount,
        };
    }

    getNFTActivity = async (txHash: string) => {
        return NFTActivity.findOne({ transactionHash: txHash });
    }

    addNFTActivity = async (
        contractAddress: string,
        activity: ActivityType,
        from: string,
        to: string,
        tokenId: string,
        transactionHash: string,
        blockNumber: number,
        betContractAddress: string = '',
    ) => {

        if (activity === ActivityType.Transfer) {
            const staked = await NFTActivity.findOne({
                contractAddress,
                activity: ActivityType.Staked,
                from,
                tokenId,
            });

            const activity = new NFTActivity({
                contractAddress,
                betContractAddress: staked?.betContractAddress || '',
                activity: staked ? ActivityType.Unstaked : ActivityType.Transfer,
                from,
                to,
                tokenId,
                transactionHash,
                blockNumber
            });

            return activity.save();
        }

        const nftActivityInstance = new NFTActivity({
            contractAddress,
            betContractAddress,
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
