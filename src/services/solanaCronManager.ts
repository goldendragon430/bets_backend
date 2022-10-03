import * as cron from 'node-cron';
import { determineBet, getTransactions } from '../utils/solana';
import BattleRepository from '../repositories/featuredBattle';
import { BattleStatus, NetworkType } from '../utils/enums';

// hash map to map keys to jobs
const jobMap: Map<string, cron.ScheduledTask> = new Map();

export const setupSolanaCronJobMap = async (): Promise<void> => {
    const determineJob = cron.schedule('* * * * *', async () => {
        try {
            const battleIds = await BattleRepository.getSolanaEndedBattles();
            console.log('determine Battle Ids', battleIds);

            for (const battleId of battleIds) {
                try {
                    await determineBet(battleId);
                    await BattleRepository.updateBattleStatusById(battleId, BattleStatus.Determine, NetworkType.SOL);
                } catch (error: any) {
                    console.error('determineBet error', battleId, error.error.errorCode);
                    if (error.error.errorCode.code === 'AlreadyEnd') {
                        await BattleRepository.updateBattleStatusById(battleId, BattleStatus.Determine, NetworkType.SOL);
                    }
                }
            }
        } catch (e) {
            console.error('determineJob Error: ', e);
        }
    }, { scheduled: false }).start();

    const transactionJob = cron.schedule('* * * * *', async () => {
        // await getTransactions();
    }, { scheduled: false });

    jobMap.set('determineJob', determineJob);
    // jobMap.set('transactionJob', transactionJob);
};
