import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const nftPointsSchema = new Schema({
        battle: {
            type: Schema.Types.ObjectId,
            ref: 'featuredBattle',
        },
        nft: {
            type: Schema.Types.ObjectId,
            ref: 'nftMetadata'
        },
        walletAddress: {
            type: String,
            required: true,
        },
        // Standard rate of 0.00694 per min
        accrualRate: {
            type: Number,
            default: 0.00694
        },  // totalAccrued field: (Today - createdAt) * AccrualRate
    },
    { timestamps: true });

export default mongoose.model('nftPoints', nftPointsSchema);
