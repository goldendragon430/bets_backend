import { BigNumber } from 'ethers';
import axios from 'axios';
import NFTActivityRepository from '../repositories/nftActivity';
import SolanaActivityRepository from '../repositories/solanaActivity';
import ClaimActivityRepository from '../repositories/claimActivity';
import FulfillActivityRepository from '../repositories/fulfillActivity';
import FinalizeActivityRepository from '../repositories/finalizeActivity';
import FeaturedBattleRepository from '../repositories/featuredBattle';
import RefundSetRepository from '../repositories/refundSet';
import ProjectRepository from '../repositories/project';
import { ActivityType, NetworkType, RewardType, ServiceType } from '../utils/enums';
import { BN } from '@project-serum/anchor';

export const nftTransferFunc = async (contractAddress: string, from: string, to: string, tokenId: BigNumber, event: any, serviceType: ServiceType) => {
    try {
        const activity = await NFTActivityRepository.getNFTActivity(event.transactionHash);
        if (!activity) {
            await NFTActivityRepository.addTransferActivity(contractAddress, from, to, tokenId.toNumber(), event.transactionHash, event.blockNumber, serviceType);
        }
    } catch (e) {
        console.error('NFT Transfer Event Err: ', e);
    }
};

export const nftStakedFunc = async (battleId: BigNumber, side: boolean, user: string, tokenIds: Array<BigNumber>, event: any, serviceType: ServiceType) => {
    try {
        const activity = await NFTActivityRepository.getNFTActivity(event.transactionHash);
        if (!activity) {
            for (const tokenId of tokenIds) {
                await NFTActivityRepository.addNFTActivity(battleId.toNumber(), side, ActivityType.Staked, user, user, tokenId.toNumber(), event.transactionHash, event.blockNumber, serviceType);
            }
        }
    } catch (e) {
        console.error('NFT Staked Event Err: ', e);
    }
};

export const battleCreateFunc = async (battleId: BigNumber, startTime: BigNumber, endTime: BigNumber, teamACollectionAddress: string, teamBCollectionAddress: string, twitterID?: string | undefined) => {
    try {
        const battle = await FeaturedBattleRepository.getBattleByQuery({ battleId: battleId, network: NetworkType.ETH });
        if (!battle) {
            await FeaturedBattleRepository.addBattle(battleId.toNumber(), startTime.toNumber(), endTime.toNumber(), teamACollectionAddress, teamBCollectionAddress, twitterID);
        } else {
            await FeaturedBattleRepository.updateBattle(battleId.toNumber(), startTime.toNumber(), endTime.toNumber(), teamACollectionAddress, teamBCollectionAddress, twitterID);
        }

    } catch (e) {
        console.error('Battle create Event Err: ', e);
    }
};

export const rewardClaimedFunc = async (battleId: BigNumber, user: string, amount: BigNumber, type: RewardType, event: any) => {
    try {
        const activity = await ClaimActivityRepository.getClaimActivity(event.transactionHash);
        if (!activity) {
            await ClaimActivityRepository.addClaimActivity(battleId.toNumber(), user, amount, type, event.transactionHash, event.blockNumber);
        }
    } catch (e) {
        console.error('Reward Claim Event Err: ', e);
    }
};

export const bettedFunc = async (battleId: BigNumber, user: string, amount: BigNumber, side: boolean, event: any) => {
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
        const activity = await FinalizeActivityRepository.getFinalizeActivity(event.transactionHash);
        if (!activity) {
            await FinalizeActivityRepository.addFinalizeActivity(battleId.toNumber(), side, chanceA.toNumber(), chanceB.toNumber(), bingo.toNumber(), event.transactionHash, event.blockNumber);
        }
    } catch (e) {
        console.error('Finalize Event Err: ', e);
    }
};

export const refundFunc = async (battleId: BigNumber, flag: boolean, event: any) => {
    try {
        const activity = await RefundSetRepository.getRefundSet(event.transactionHash);
        if (!activity) {
            await RefundSetRepository.addRefundSet(battleId.toNumber(), flag, event.transactionHash, event.blockNumber);
        }
    } catch (e) {
        console.error('RefundSet Event Err: ', e);
    }
};

export const syncProjectFromOpensea = async (slug: string) => {
    try {
        const { data } = await axios.get(`https://api.opensea.io/api/v1/collection/${slug}/stats`);
        await ProjectRepository.updateProjectBySlug(slug, data.stats.floor_price, data.stats.num_owners);
    } catch (e) {
        console.error('While syncing data from opensea: ', e);
    }
};

export const syncProjectFromMagicEden = async (slug: string) => {
    try {
        const { data } = await axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${slug}/stats`);
        await ProjectRepository.updateProjectBySlug(slug, (data.floorPrice / 1000000000), data.listedCount);
    } catch (e) {
        console.error('While syncing data from MagicEden: ', e);
    }
};

export const solanaStakedFunc = async (battleId: string, side: boolean, user: string, nftPubkey: string, amount: BN, signature: string, slot: number) => {
    try {
        const activity = await SolanaActivityRepository.getSolanaActivity(signature);
        if (!activity) {
            await SolanaActivityRepository.addStakedActivity(battleId, side, user, nftPubkey, amount, signature, slot);
        }
    } catch (e) {
        console.error('Solana Staked Event Err: ', e);
    }
};

export const solanaBettedFunc = async (battleId: string, user: string, amount: BN, side: boolean, signature: string, slot: number) => {
    try {
        const activity = await SolanaActivityRepository.getSolanaActivity(signature);
        if (!activity) {
            await SolanaActivityRepository.addBettedActivity(battleId, user, amount, side, signature, slot);
        }
    } catch (e) {
        console.error('Solana Staked Event Err: ', e);
    }
};
