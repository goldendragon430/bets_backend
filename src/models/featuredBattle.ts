import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const featuredBattleSchema = new Schema({
    projectL: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    projectR: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    betContractAddress: {
        type: String,
        required: true,
    },
    startDate: Date,
    endDate: Date,
    winner: Schema.Types.ObjectId,
    twitterAnnounceID: String,
},
{ timestamps: true });

featuredBattleSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.createdAt = undefined;
    object.updatedAt = undefined;
    return object;
});

export default mongoose.model('featuredBattle', featuredBattleSchema);
