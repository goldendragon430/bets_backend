import LootboxContent from '../models/lootboxContent';

class LootboxContentRepository {
    constructor() {}

    getLootboxContents = async () => {
        return LootboxContent.find({});
    }

    getLootboxContent = async (id) => {
        return LootboxContent.findOne({ _id: id });
    }

    addLootboxContent = async(
        lootbox: any,
        loot: any,
        probability: number,
    ) => {
        const lootboxContentInstance = new LootboxContent({
            lootbox,
            loot,
            probability,
        });

        return lootboxContentInstance.save();
    }
}

export default new LootboxContentRepository();
