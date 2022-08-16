
import loot from '../models/loot';

interface LootInterface {
    name: string;
    symbol: string;
    value: string;
    text: string;
    imageLink: string;
    metadataLink: string;
}

class LootRepository {
    constructor() {}

    getLoots = async () => {
        return loot.find({});
    }

    getLoot = async (id) => {
        return loot.findOne({ _id: id });
    }

    addLoot = async(
        name: string,
        value: string,
        text: string,
        imageLink: string,
        metadataLink: string,
        symbol: string,
    ) => {
        const lootInstance = new loot({
            name,
            value,
            text,
            imageLink,
            metadataLink,
            symbol,
        });

        return lootInstance.save();
    }

    setLoots = async(list: Array<LootInterface>) => {
        try {
            await loot.remove({});
            return await loot.insertMany(list);
        } catch (error) {
            return false;
        }
    }
}

export default new LootRepository();
