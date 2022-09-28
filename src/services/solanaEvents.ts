import { solanaStakedFunc, solanaBettedFunc } from './getEventFunc';
import { getProgram, getTestProgram } from '../utils/solana';

export const installSolanaEvents = () => {
    const solanaProgram = getProgram();
    const testProgram = getTestProgram();

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

    // TODO: It's just for testing purpose
    testProgram.addEventListener('MyEvent', (event, slot) => {
        console.log(event, slot);
    });

    testProgram.addEventListener('MyOtherEvent', (event, slot) => {
        console.log(event, slot);
    });

    console.log('Initialized All solana events watching');
};
