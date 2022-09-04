import * as mongoose from 'mongoose';
import { ActivityType, ServiceType } from '../utils/enums';

const Schema = mongoose.Schema;

const nftActivitySchema = new Schema({
    activity: {
        type: String,
        enum: [ActivityType.Transfer, ActivityType.Staked, ActivityType.Unstaked, ActivityType.Betted],
        default: ActivityType.Transfer
    },
    battleId: {
        type: Number,
        required: true,
    },
    contractAddress: String,
    from: String,
    to: String,
    amount: String,
    amountInDecimal: Number,
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
