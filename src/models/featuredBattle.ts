import * as mongoose from 'mongoose';
import { NetworkType } from '../utils/enums';

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
    battleLength: Number, // # minutes of battle
    network: {
        type: String,
        enum: [NetworkType.ETH, NetworkType.SOL, NetworkType.ADA],
        defaultValue: NetworkType.ETH,
    },
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    twitterAnnounceID: String,
},
{ timestamps: true });

featuredBattleSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.endDate = new Date(object.startDate.getTime() + (object.battleLength ? object.battleLength * 60000 : 0));
    object.createdAt = undefined;
    object.updatedAt = undefined;
    return object;
});

export default mongoose.model('featuredBattle', featuredBattleSchema);
