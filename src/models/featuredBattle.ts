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
    startDate: Date,
    endDate: Date,
    winner: Schema.Types.ObjectId,
    twitterAnnounceID: String,
},
{ timestamps: true });

featuredBattleSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

export default mongoose.model('featuredBattle', featuredBattleSchema);
