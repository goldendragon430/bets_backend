import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const lootSchema = new Schema({
    name: String,
    symbol: String,
    value: String,
    text: String,
    imageLink: String,
    metadataLink: String,
},
{ timestamps: true });

export default mongoose.model('loot', lootSchema);
