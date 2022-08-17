import Blacklist from '../models/blacklist';

class BlackListRepository {
    constructor() {}

    getBlacklists = async () => {
        return Blacklist.find({});
    }

    getBlacklist = async () => {
        const now = new Date();
        return Blacklist.findOne({
            startDate: { $lte: now },
            endDate: { $gte: now },
        });
    }

    addBlackList = async(
        userAddress: string,
        tokenId: number,
        processed: boolean,
        transactionHash: string,
    ) => {
        const battle = new Blacklist({
            userAddress,
            tokenId,
            processed,
            transactionHash,
        });

        return battle.save();
    }
}

export default new BlackListRepository();
