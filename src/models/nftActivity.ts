import * as mongoose from 'mongoose';
import { ActivityType, ServiceType } from '../utils/enums';

const Schema = mongoose.Schema;

const nftActivitySchema = new Schema({
    activity: {
        type: String,
        enum: [ActivityType.Transfer, ActivityType.Staked, ActivityType.Unstaked],
        default: ActivityType.Transfer
    },
    battleId: Number,
    contractAddress: String,
    from: String,
    to: String,
    tokenId: String,
    transactionHash: String,
    blockNumber: Number,
    source: {
        type: String,
        enum: [ServiceType.Cron, ServiceType.PastEvent, ServiceType.Contract],
    }
},
    { timestamps: true });

export default mongoose.model('nftActivities', nftActivitySchema);
