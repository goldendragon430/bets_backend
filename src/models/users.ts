import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: String,
    address: {
        type: String,
        required: true,
    },
    selectedNFT: Schema.Types.Mixed,
    nonce: Number,
    signature: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    wallets: [{
        type: Schema.Types.ObjectId,
        ref: 'playerWallet'
    }]
},
{ timestamps: true });

export interface INFTMetadata {
    contract: string;
    tokenId: string;
    image: string;
}

export default mongoose.model('users', usersSchema);
