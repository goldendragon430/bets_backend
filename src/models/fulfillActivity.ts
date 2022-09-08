import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const fulfillActivitySchema = new Schema({
    battleId: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    transactionHash: String,
    blockNumber: Number,
},
    { timestamps: true });

export default mongoose.model('fulfillActivities', fulfillActivitySchema);
