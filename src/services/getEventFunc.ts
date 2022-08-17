import nftActivity from '../repositories/nftActivity';
import { ActivityType } from '../utils/enums';

export const nftTransferFunc = async (contractAddress, from, to, tokenId, event) => {
    try {
        const activity = nftActivity.getNFTActivity(event.transactionHash);
        if (!activity) {
            return;
        }
        await nftActivity.addNFTActivity(contractAddress, ActivityType.Transfer, from, to, tokenId, event.transactionHash, event.blockNumber);

        // Check if current NFT is staked or not from BET contract
    } catch (e) {
        console.error('NFT Transfer Event Err: ', e);
    }
};
