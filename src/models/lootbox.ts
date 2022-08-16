import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const lootboxSchema = new Schema({
    name: String,
    symbol: String,
    imageLink: String,
    metadataLink: String,
},
{ timestamps: true });

export default mongoose.model('lootbox', lootboxSchema);
