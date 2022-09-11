import * as mongoose from 'mongoose';
import { NetworkType } from '../utils/enums';

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subName: {
        type: String,
        required: true,
    },
    network: {
        type: String,
        enum: [NetworkType.ETH, NetworkType.SOL, NetworkType.ADA],
        default: NetworkType.ETH,
    },
    contract: {
        type: String,
        required: true,
    },
    collectionSize: Number,
    twitterID: {
        type: String,
        required: true,
    },
    creator: String,
    metadataFilter: String,
    comment: String,
    logo: String,
    headerImage: {
        type: String,
        required: true,
    },
    openSeaLink: String,
    magicEdenLink: String,
    discordLink: String,
},
{ timestamps: true });

projectSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.createdAt = undefined;
    object.updatedAt = undefined;
    return object;
});

export default mongoose.model('project', projectSchema);
