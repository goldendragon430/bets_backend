import nftActivity from '../repositories/nftActivity';
import { ActivityType } from '../utils/enums';

export const nftTransferFunc = async (contractAddress, from, to, tokenId, event) => {
    try {
        const activity = await nftActivity.getNFTActivity(event.transactionHash);
        if (!activity) {
            await nftActivity.addNFTActivity(contractAddress, ActivityType.Transfer, from, to, tokenId, event.transactionHash, event.blockNumber);
        }
        // Check if current NFT is staked or not from BET contract
    } catch (e) {
        console.error('NFT Transfer Event Err: ', e);
    }
};

export const nftStakedFunc = async (collectionAddress: string, user: string, tokenIds: Array<number>, event) => {
    try {
        const activity = await nftActivity.getNFTActivity(event.transactionHash);
        if (!activity) {
            for (const tokenId of tokenIds) {
                await nftActivity.addNFTActivity(collectionAddress, ActivityType.Staked, user, user, tokenId.toString(), event.transactionHash, event.blockNumber);
            }
        }
    } catch (e) {
        console.error('NFT Staked Event Err: ', e);
    }
};
