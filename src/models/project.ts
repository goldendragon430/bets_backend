import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    subName: String,
    contract: String,
    collectionSize: Number,
    twitterID: String,
    metadataFilter: String,
    logo: String,
    headerImage: String,
    openSeaLink: String,
    magicEdenLink: String,
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
