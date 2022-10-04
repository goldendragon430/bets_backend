import { solanaStakedFunc, solanaBettedFunc } from './getEventFunc';
import { getProgram } from '../utils/solana';

export const installSolanaEvents = () => {
    const solanaProgram = getProgram();

    solanaProgram.addEventListener('stake', async (event, slot, signature) => {
        console.log(event, slot, signature);
        const { battleId, side, user, tokenIds } = event;

        await solanaStakedFunc(battleId, side, user, tokenIds, signature, slot);
    });

    solanaProgram.addEventListener('user_bet', async (event, slot, signature) => {
        console.log(event, slot, signature);
        const { battleId, user, amount, side } = event;

        await solanaBettedFunc(battleId, user, amount, side, signature, slot);
    });

    console.log('Initialized All solana events watching');
};
