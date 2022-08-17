import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blackListSchema = new Schema({
        userAddress: {
            type: String,
            required: true,
        },
        tokenId: {
            type: Number,
            required: true,
        },
        processed: {
            type: Boolean,
            defaultValue: false,
        },
        transactionHash: String
    },
    {timestamps: true});

blackListSchema.method('toJSON', function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

export default mongoose.model('blackList', blackListSchema);
