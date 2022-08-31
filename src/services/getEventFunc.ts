import NFTActivityRepository from '../repositories/nftActivity';
import ClaimActivityRepository from '../repositories/claimActivity';
import FulfillActivityRepository from '../repositories/fulfillActivity';
import FinalizeActivityRepository from '../repositories/finalizeActivity';
import FeaturedBattleRepository from '../repositories/featuredBattle';
import { ActivityType, ServiceType } from '../utils/enums';
import { BigNumber } from 'ethers';

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

export const abpClaimedFunc = async (battleId: number, user: string, amount: BigNumber, event: any) => {
    try {
        const activity = await ClaimActivityRepository.getClaimActivity(event.transactionHash);
        if (!activity) {
            await ClaimActivityRepository.addClaimActivity(battleId, user, amount, event.transactionHash, event.blockNumber);
        }
    } catch (e) {
        console.error('ABP Claim Event Err: ', e);
    }
};

export const fulfilledFunc = async (battleId: BigNumber, timestamp: BigNumber, event: any) => {
    try {
        const activity = await FulfillActivityRepository.getFulfillActivity(event.transactionHash);
        if (!activity) {
            await FulfillActivityRepository.addFulfillActivity(battleId.toNumber(), timestamp.toNumber(), event.transactionHash, event.blockNumber);
        }
    } catch (e) {
        console.error('Fulfill Event Err: ', e);
    }
};

export const finalizedFunc = async (battleId: BigNumber, side: boolean, chanceA: BigNumber, chanceB: BigNumber, bingo: BigNumber, event: any) => {
    try {
        const activity = await FinalizeActivityRepository.getFinalizeActivity(event.transactionHash);
        if (!activity) {
            await FinalizeActivityRepository.addFinalizeActivity(battleId.toNumber(), side, chanceA.toNumber(), chanceB.toNumber(), bingo.toNumber(), event.transactionHash, event.blockNumber);
        }
    } catch (e) {
        console.error('Finalize Event Err: ', e);
    }
};
