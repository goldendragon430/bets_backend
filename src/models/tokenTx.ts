import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tokenTxSchema = new Schema({
    battle: {
        type: Schema.Types.ObjectId,
        ref: 'featuredBattle'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    transactionType: { // Stake, Burn
        type: String,
        required: true,
    },
    multiplier: {
        type: Number,
        required: true,
    },
    tokenType: {
        type: String,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true
    },
    chainType: {
        type: Boolean,
        required: true
    },
    claimableTime: Number, // 0 for Burn, 30 days for Stake
    walletAddress: String,
    onChainVerification: String,
},
{ timestamps: true });

export default mongoose.model('tokenTx', tokenTxSchema);
