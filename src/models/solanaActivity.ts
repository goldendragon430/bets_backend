import * as mongoose from 'mongoose';
import { ActivityType } from '../utils/enums';

const Schema = mongoose.Schema;

const solanaActivitySchema = new Schema({
    activity: {
        type: String,
        enum: [ActivityType.Transfer, ActivityType.Staked, ActivityType.Unstaked, ActivityType.Betted],
        default: ActivityType.Staked
    },
    battleId: {
        type: String,
        required: true,
    },
    side: {
        type: Boolean,
        required: true,
    },
    from: String,
    to: String,
    amount: String,
    amountInDecimal: Number,
    tokenId: String,
    signature: String,
    slot: Number,
    blockTime: Number,
},
    { timestamps: true });

export default mongoose.model('solanaActivities', solanaActivitySchema);
