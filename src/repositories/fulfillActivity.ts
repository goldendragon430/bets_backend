import FulfillActivity from '../models/fulfillActivity';

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
