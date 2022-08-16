import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const nftStakedSchema = new Schema({
    battle: {
        type: Schema.Types.ObjectId,
        ref: 'featuredBattle',
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    nft: {
        type: Schema.Types.ObjectId,
        ref: 'nftMetadata'
    },
    transactionType: {
        type: String,
        required: true
    },
    multiplier: {
        type: Number,
        required: true
    },
    tokenType: {
        type: String,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    onChainVerification: {
        type: String,
        required: true
    }
},
{ timestamps: true });

export default mongoose.model('nftStaked', nftStakedSchema);
