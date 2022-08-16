import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const lootboxContentSchema = new Schema({
        lootbox: {
            type: Schema.Types.ObjectId,
            ref: 'lootbox'
        },
        loot: {
            type: Schema.Types.ObjectId,
            ref: 'loot'
        },
        probability: Number,
    },
    {timestamps: true});

export default mongoose.model('lootboxContent', lootboxContentSchema);
