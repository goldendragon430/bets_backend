import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const playerWalletSchema = new Schema({
    network: String,
    walletAddress: String,
    pointsUnclaimed: Number,
    medals: Number
},
{timestamps: true});

export default mongoose.model('playerWallet', playerWalletSchema);