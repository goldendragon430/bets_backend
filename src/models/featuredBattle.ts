import * as mongoose from 'mongoose';
import { NetworkType, BattleStatus } from '../utils/enums';

const Schema = mongoose.Schema;

const featuredBattleSchema = new Schema({
    projectL: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'project',
    },
    projectR: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'project',
    },
    battleId: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        requried: true,
    },
    startTime: Number, // This field is not in ERD but need to be added for filtering of simplicity
    endTime: Number, // This field is not in ERD but need to be added for filtering of simplicity
    battleLength: Number, // # minutes of battle
    status: {
        type: String,
        enum: [
            BattleStatus.Created, BattleStatus.RequestRandomWords, BattleStatus.Fulfilled,
            BattleStatus.Finalized, BattleStatus.RefundSet, BattleStatus.Determine
        ],
        default: BattleStatus.Created,
    },
    finalizeFailedCount: {
        type: Number,
        default: 0,
    },
    network: {
        type: String,
        enum: [NetworkType.ETH, NetworkType.POLYGON, NetworkType.SOL, NetworkType.ADA],
        default: NetworkType.ETH,
    },
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    twitterAnnounceID: String,
    active: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true });

featuredBattleSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.endDate = new Date(object.startDate.getTime() + (object.battleLength ? object.battleLength * 1000 : 0));
    object.createdAt = undefined;
    object.updatedAt = undefined;
    return object;
});

export default mongoose.model('featuredBattle', featuredBattleSchema);
