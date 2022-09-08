import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const finalizeActivitySchema = new Schema({
    battleId: {
        type: Number,
        required: true,
    },
    side: {  // false -> ProjectL, true -> ProjectR
        type: Boolean,
        default: false,
    },
    chanceA: {
        type: Number,
        required: true,
    },
    chanceB: {
        type: Number,
        required: true,
    },
    bingo: {
        type: Number,
        required: true,
    },
    transactionHash: String,
    blockNumber: Number,
},
    { timestamps: true });

export default mongoose.model('finalizeActivities', finalizeActivitySchema);
