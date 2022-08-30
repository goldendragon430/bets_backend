import FinalizeActivity from '../models/finalizeActivity';

class FinalizeActivityRepository {
    constructor() { }

    getFinalizeActivity = async (txHash: string) => {
        return FinalizeActivity.findOne({ transactionHash: txHash });
    }

    addFinalizeActivity = async (
        battleId: number,
        side: boolean,
        chanceA: number,
        chanceB: number,
        bingo: number,
        transactionHash: string,
        blockNumber: number,
    ) => {
        const finalizeActivityInstance = new FinalizeActivity({
            battleId,
            side,
            chanceA,
            chanceB,
            bingo,
            transactionHash,
            blockNumber,
        });

        return finalizeActivityInstance.save();
    }
}

export default new FinalizeActivityRepository();
