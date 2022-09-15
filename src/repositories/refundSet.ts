import RefundSet from '../models/refundSet';
import FeaturedBattle from '../models/featuredBattle';
import { BattleStatus } from '../utils/enums';

class RefundSetRepository {
    constructor() { }

    getRefundSet = async (txHash: string) => {
        return RefundSet.findOne({ transactionHash: txHash });
    }

    addRefundSet = async (
        battleId: number,
        flag: boolean,
        transactionHash: string,
        blockNumber: number,
    ) => {
        await FeaturedBattle.updateOne(
            { battleId: battleId },
            { $set: { status: flag ? BattleStatus.RefundSet : BattleStatus.Created } },
        );

        const refundSet = new RefundSet({
            battleId,
            flag,
            transactionHash,
            blockNumber,
        });

        return refundSet.save();
    }
}

export default new RefundSetRepository();
