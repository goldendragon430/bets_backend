import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const refundSetSchema = new Schema({
    battleId: {
        type: Number,
        required: true,
    },
    flag: {
        type: Boolean,
        required: true,
    },
    transactionHash: String,
    blockNumber: Number,
},
    { timestamps: true });

export default mongoose.model('refundSet', refundSetSchema);
