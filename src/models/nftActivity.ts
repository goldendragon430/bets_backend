import * as mongoose from 'mongoose';
import { ActivityType } from '../utils/enums';

const Schema = mongoose.Schema;

const nftActivitySchema = new Schema({
        activity: {
            type: String,
            enum: [ActivityType.Transfer, ActivityType.Staked, ActivityType.Unstaked],
            default: ActivityType.Transfer
        },
        betContractAddress: String,
        contractAddress: String,
        from: String,
        to: String,
        tokenId: String,
        transactionHash: String,
        blockNumber: Number,
    },
    {timestamps: true});

export default mongoose.model('nftActivities', nftActivitySchema);
