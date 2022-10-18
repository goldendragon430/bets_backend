import { solanaBettedFunc, solanaClaimFunc, solanaStakedFunc } from './getEventFunc';
import { getProgram } from '../utils/solana';
import { RewardType } from '../utils/enums';

export const installSolanaEvents = () => {
    const solanaProgram = getProgram();

    // as you can see in this parameter, we can get the event data, third one is for signature
    solanaProgram.addEventListener('FeedTx', async (event, slot, signature) => {
        const { battleId, addr, side, betAmount, stakeCount, stakeMint, claimAmount, abpAmount, txType, timeStamp } = event;
        // console.log('battleId', battleId);
        // console.log('addr', addr);
        // console.log('side', side);
        // console.log('betAmount', betAmount);
        // console.log('stakeCount', stakeCount);
        // console.log('stakeMint', stakeMint);
        // console.log('claimAmount', claimAmount);
        // console.log('abpAmount', abpAmount);
        // console.log('txType', txType);
        // console.log('timeStamp', timeStamp);
        // console.log('signature', signature);
        // console.log('slot', slot);
        if (txType === 2) {
            await solanaStakedFunc(battleId, side, addr, stakeMint, stakeCount, signature, slot, timeStamp);
        } else if (txType === 1) {
            await solanaBettedFunc(battleId, addr, betAmount, side, signature, slot, timeStamp);
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
