import NFTActivityRepository from '../repositories/nftActivity';
import FeaturedBattleRepository from '../repositories/featuredBattle';
import { ActivityType, ServiceType } from '../utils/enums';

export const nftTransferFunc = async (contractAddress: string, from: string, to: string, tokenId: string, event: any, serviceType: ServiceType) => {
    try {
        const activity = await NFTActivityRepository.getNFTActivity(event.transactionHash);
        if (!activity) {
            await NFTActivityRepository.addNFTActivity(0, contractAddress, ActivityType.Transfer, from, to, tokenId, event.transactionHash, event.blockNumber, serviceType);
        }
    } catch (e) {
        console.error('NFT Transfer Event Err: ', e);
    }
};

export const nftStakedFunc = async (battleId: number, collectionAddress: string, user: string, tokenIds: Array<number>, event: any, serviceType: ServiceType) => {
    try {
        const activity = await NFTActivityRepository.getNFTActivity(event.transactionHash);
        if (!activity) {
            for (const tokenId of tokenIds) {
                await NFTActivityRepository.addNFTActivity(battleId, collectionAddress, ActivityType.Staked, user, user, tokenId.toString(), event.transactionHash, event.blockNumber, serviceType);
            }
        }
    } catch (e) {
        console.error('NFT Staked Event Err: ', e);
    }
};

export const battleCreateFunc = async (battleId: number, startTime: number, endTime: number, teamACollectionAddress: string, teamBCollectionAddress: string) => {
    try {
        const battle = await FeaturedBattleRepository.getBattleByQuery({ battleId: battleId });
        if (!battle) {
            await FeaturedBattleRepository.addBattle(battleId, startTime, endTime, teamACollectionAddress, teamBCollectionAddress);
        }

    } catch (e) {
        console.error('Battle create Event Err: ', e);
    }
};
