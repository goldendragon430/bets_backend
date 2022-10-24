import * as cron from 'node-cron';
import { determineBet, getBetInfo, subscribeSolanaTransactions } from '../utils/solana';
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
                    console.error('While determineBet error:', battleId, error);
                    if (error.error.errorCode.code === 'AlreadyEnd') {
                        await BattleRepository.updateBattleStatusById(battleId, BattleStatus.Determine, NetworkType.SOL);
                    }
                }
            }
        } catch (e) {
            console.error('determineJob Error: ', e);
        }
    }, { scheduled: false }).start();

    const refundStatusUpdateJob = cron.schedule('* * * * *', async () => {
        try {
            const battleIds = await BattleRepository.getSolanaEndedBattles();

            for (const battleId of battleIds) {
                try {
                    const info = await getBetInfo(battleId);
                    const result = info.winnerResult
                    if (result === 3) {
                        await BattleRepository.updateBattleStatusById(battleId, BattleStatus.RefundSet, NetworkType.SOL);
                    }
                } catch (error: any) {
                    console.error('While getBetInfo error:', battleId, error);
                }
            }
        } catch (e) {
            console.error('refundStatusUpdateJob Error: ', e);
        }
    }, { scheduled: false }).start();

    jobMap.set('determineJob', determineJob);
    jobMap.set('refundStatusUpdateJob', refundStatusUpdateJob);

    subscribeSolanaTransactions();
};
