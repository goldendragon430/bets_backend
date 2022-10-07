import * as mongoose from 'mongoose';
import { RewardType } from '../utils/enums';

const Schema = mongoose.Schema;

const solanaClaimActivitySchema = new Schema({
    battleId: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true,
    },
    rewardType: {
        type: String,
        enum: [RewardType.ABP, RewardType.ETH],
        default: RewardType.ABP,
    },
    amountInDecimal: {
        type: Number,
        required: true,
    },
    transactionHash: String,
    blockNumber: Number,
},
    { timestamps: true });

export default mongoose.model('solanaClaimActivities', solanaClaimActivitySchema);
