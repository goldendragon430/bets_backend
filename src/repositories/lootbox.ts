import lootbox from '../models/lootbox';

interface LootboxInterface {
    _id: string;
    name: string;
    symbol: string;
    imageLink: string;
    metadataLink: string;
}

class LootboxRepository {
    constructor() {}

    getlootboxs = async () => {
        return lootbox.find({});
    }

    getlootbox = async (id) => {
        return lootbox.findOne({ _id: id });
    }

    addlootbox = async(
        name: string,
        image: string,
        metadataUri: string,
        symbol: string,
    ) => {
        const lootboxInstance = new lootbox({
            name,
            image,
            metadataUri,
            symbol
        });

        return lootboxInstance.save();
    }

    setLootboxs = async(list: Array<LootboxInterface>) => {
        try {
            await Promise.all(list.map(async item => {
                await lootbox.updateOne({_id: item._id}, {$set: item}, {upsert: true});
            }));
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default new LootboxRepository();