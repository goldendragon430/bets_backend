import FulfillActivity from '../models/fulfillActivity';
import FeaturedBattle from '../models/featuredBattle';
import { BattleStatus } from '../utils/enums';

class FulfillActivityRepository {
    constructor() { }

    getFulfillActivity = async (txHash: string) => {
        return FulfillActivity.findOne({ transactionHash: txHash });
    }

    addFulfillActivity = async (
        battleId: number,
        timestamp: number,
        transactionHash: string,
        blockNumber: number,
    ) => {
        await FeaturedBattle.updateOne(
            { battleId: battleId },
            { $set: { status: BattleStatus.Fulfilled } },
        );

        const fulfillActivityInstance = new FulfillActivity({
            battleId,
            timestamp,
            transactionHash,
            blockNumber,
        });

        return fulfillActivityInstance.save();
    }
}

export default new FulfillActivityRepository();
