import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const nftMetadataSchema = new Schema({
        name: String,
        image: String,
        address: String
    },
    {timestamps: true});

export default mongoose.model('nftMetadata', nftMetadataSchema);
