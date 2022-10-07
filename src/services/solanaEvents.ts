import { solanaBettedFunc, solanaClaimFunc, solanaStakedFunc } from './getEventFunc';
import { getProgram } from '../utils/solana';
import { RewardType } from '../utils/enums';

export const installSolanaEvents = () => {
    const solanaProgram = getProgram();

    solanaProgram.addEventListener('FeedTx', async (event, slot, signature) => {
        const { battleId, addr, side, betAmount, stakeCount, stakeMint, claimAmount, abpAmount, txType, timeStamp } = event;
        if (txType === 2) {
            await solanaStakedFunc(battleId, side, addr, stakeMint, stakeCount, signature, slot);
        } else if (txType === 1) {
            await solanaBettedFunc(battleId, addr, betAmount, side, signature, slot);
        } else if (txType === 3) {
            if (abpAmount.toNumber() > 0) {
                await solanaClaimFunc(battleId, addr, abpAmount, RewardType.ABP, signature, slot);
            } else {
                await solanaClaimFunc(battleId, addr, claimAmount, RewardType.ETH, signature, slot);
            }
        }
    });

    console.log('Initialized All solana events watching');
};
