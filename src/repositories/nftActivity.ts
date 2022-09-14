import { BigNumber, ethers } from 'ethers';
import NFTActivity from '../models/nftActivity';
import FeaturedBattleRepository from './featuredBattle';
import { ActivityType, NetworkType, ServiceType } from '../utils/enums';

class NFTActivityRepository {
    constructor() { }

    getStakedStatus = async (tokenIds: Array<string>, contractAddress: string, battleId: number) => {
        const status: Array<{ tokenId: string, status: boolean }> = [];
        for (const tokenId of tokenIds) {
            const activity = await NFTActivity.findOne({
                tokenId,
                contractAddress,
                battleId,
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
            battleId: battle.battleId,
            activity: ActivityType.Staked
        });
        const collectionBStakedCount = await NFTActivity.count({
            contractAddress: battle.projectR?.contract,
            battleId: battle.battleId,
            activity: ActivityType.Staked
        });
        const collectionAUnstakedCount = await NFTActivity.count({
            contractAddress: battle.projectL?.contract,
            battleId: battle.battleId,
            activity: ActivityType.Unstaked
        });
        const collectionBUnstakedCount = await NFTActivity.count({
            contractAddress: battle.projectR?.contract,
            battleId: battle.battleId,
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
        battleId: number,
        side: boolean,
        activity: ActivityType,
        from: string,
        to: string,
        tokenId: number,
        transactionHash: string,
        blockNumber: number,
        serviceType: ServiceType,
    ) => {
        const battle = await FeaturedBattleRepository.getBattleByBattleId(battleId);

        let contractAddress = '';
        if (battle) {
            contractAddress = (side ? battle.projectR?.contract : battle.projectL?.contract) || '';
        }
        // side = true is team B, false is team A
        const nftActivityInstance = new NFTActivity({
            battleId,
            side,
            contractAddress,
            activity,
            from,
            to,
            tokenId,
            transactionHash,
            blockNumber,
            source: serviceType,
        });

        return nftActivityInstance.save();
    }

    addTransferActivity = async (
        contractAddress: string,
        from: string,
        to: string,
        tokenId: number,
        transactionHash: string,
        blockNumber: number,
        serviceType: ServiceType,
    ) => {
        const activeBattleIds = await FeaturedBattleRepository.getActiveBattleIds(NetworkType.ETH);

        const stakedList = await NFTActivity.find({
            contractAddress,
            activity: ActivityType.Staked,
            battleId: { $in: activeBattleIds },
            from,
            tokenId,
        });

        for (const staked of stakedList) {
            const activity = new NFTActivity({
                contractAddress,
                side: staked.side,
                battleId: staked?.battleId || 0,
                activity: staked ? ActivityType.Unstaked : ActivityType.Transfer,
                from,
                to,
                tokenId,
                transactionHash,
                blockNumber,
                source: serviceType,
            });
            await activity.save();
        }
        return;
    }

    addBettedActivity = async (
        battleId: number,
        user: string,
        amount: BigNumber,
        side: boolean,
        transactionHash: string,
        blockNumber: number,
    ) => {
        const battle = await FeaturedBattleRepository.getBattleByBattleId(battleId);
        const contractAddress = !side ? battle?.projectL?.contract : battle?.projectR?.contract;
        const from = user;
        const to = user;

        const nftActivityInstance = new NFTActivity({
            battleId,
            contractAddress,
            activity: ActivityType.Betted,
            from,
            to,
            amount: amount.toString(),
            amountInDecimal: parseFloat(ethers.utils.formatEther(amount)),
            tokenId: '',
            transactionHash,
            blockNumber,
            source: ServiceType.Contract,
        });

        return nftActivityInstance.save();
    }
}

export default new NFTActivityRepository();
