import { solanaStakedFunc, solanaBettedFunc } from './getEventFunc';
import { getProgram } from '../utils/solana';

export const installSolanaEvents = () => {
    const solanaProgram = getProgram();

    solanaProgram.addEventListener('stake', async (event, slot, signature) => {
        console.log(event, slot, signature);
        const { battleId, side, user, tokenIds } = event;

        // await solanaStakedFunc(battleId, side, user, tokenIds, signature, slot);
    });

    solanaProgram.addEventListener('user_bet', async (event, slot, signature) => {
        console.log(event, slot, signature);
        const { battleId, user, amount, side } = event;

        // await solanaBettedFunc(battleId, user, amount, side, signature, slot);
    });

    solanaProgram.addEventListener('FeedTx', (e, s) => {
        console.log('tx: slot=', s);
        console.log('tx: addr=', e.addr);
        console.log('tx: side=', e.side ? 'Right' : 'Left');
        console.log('tx: betAmount=', e.betAmount / 1e9);
        console.log('tx: stakeCount', e.stakeCount);
        console.log('tx: timeStamp', e.timeStamp);
        console.log('tx: txType=', e.txType ? 'Bet' : 'Stake');
        // if(!isInEvents(s.toString())) {
        //     const event: BattleEvent = {
        //         txHash: s.toString(),
        //         user: e.addr,
        //         side: e.side,
        //         timestamp: e.timeStamp,
        //         amount: e.txType ? e.betAmount / 1e9 : e.stakeCount,
        //         action: e.txType ? 'Betted' : 'Staked',
        //     }
        //     setTestEvents([...testEvents, event]);
        // }
    });

    console.log('Initialized All solana events watching');
};
