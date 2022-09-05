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

export const nftStakedFunc = async (battleId: BigNumber, collectionAddress: string, user: string, tokenIds: Array<BigNumber>, event: any, serviceType: ServiceType) => {
    try {
        const activity = await NFTActivityRepository.getNFTActivity(event.transactionHash);
        if (!activity) {
            for (const tokenId of tokenIds) {
                await NFTActivityRepository.addNFTActivity(battleId.toNumber(), collectionAddress, ActivityType.Staked, user, user, tokenId.toString(), event.transactionHash, event.blockNumber, serviceType);
            }
        }
    } catch (e) {
        console.error('NFT Staked Event Err: ', e);
    }
};

export const battleCreateFunc = async (battleId: BigNumber, startTime: BigNumber, endTime: BigNumber, teamACollectionAddress: string, teamBCollectionAddress: string, twitterID: string = '') => {
    try {
        const battle = await FeaturedBattleRepository.getBattleByQuery({ battleId: battleId });
        if (!battle) {
            await FeaturedBattleRepository.addBattle(battleId.toNumber(), startTime.toNumber(), endTime.toNumber(), teamACollectionAddress, teamBCollectionAddress, twitterID);
        } else {
            await FeaturedBattleRepository.updateBattle(battleId.toNumber(), startTime.toNumber(), endTime.toNumber(), teamACollectionAddress, teamBCollectionAddress, twitterID);
        }

    } catch (e) {
        console.error('Battle create Event Err: ', e);
    }
};

export const abpClaimedFunc = async (battleId: BigNumber, user: string, amount: BigNumber, event: any) => {
    try {
        const activity = await ClaimActivityRepository.getClaimActivity(event.transactionHash);
        if (!activity) {
            await ClaimActivityRepository.addClaimActivity(battleId.toNumber(), user, amount, event.transactionHash, event.blockNumber);
        }
    } catch (e) {
        console.error('ABP Claim Event Err: ', e);
    }
};

export const bettedFunc = async (battleId: BigNumber, user: string, amount: BigNumber, side: false, event: any) => {
    try {
        const activity = await NFTActivityRepository.getNFTActivity(event.transactionHash);
        if (!activity) {
            await NFTActivityRepository.addBettedActivity(
                battleId.toNumber(),
                user,
                amount,
                side,
                event.transactionHash,
                event.blockNumber
            );
        }
    } catch (e) {
        console.error('Betted Event Err: ', e);
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
        console.log(battleId, side, chanceA, chanceB, bingo, event);
        const activity = await FinalizeActivityRepository.getFinalizeActivity(event.transactionHash);
        if (!activity) {
            await FinalizeActivityRepository.addFinalizeActivity(battleId.toNumber(), side, chanceA.toNumber(), chanceB.toNumber(), bingo.toNumber(), event.transactionHash, event.blockNumber);
        }
    } catch (e) {
        console.error('Finalize Event Err: ', e);
    }
};
