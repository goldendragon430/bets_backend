import * as mongoose from 'mongoose';
import { ActivityType } from '../utils/enums';

const Schema = mongoose.Schema;

const nftActivitySchema = new Schema({
        activity: {
            type: String,
            enum: [ActivityType.Transfer, ActivityType.Claimed, ActivityType.Purchased],
            default: ActivityType.Transfer
        },
        contractAddress: String,
        from: String,
        to: String,
        tokenId: String,
        transactionHash: String,
        blockNumber: Number,
    },
    {timestamps: true});

export default mongoose.model('nftActivities', nftActivitySchema);
