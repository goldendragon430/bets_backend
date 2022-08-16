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

export default mongoose.model('project', projectSchema);
