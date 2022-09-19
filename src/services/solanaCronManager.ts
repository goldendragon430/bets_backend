import * as cron from 'node-cron';
import { determineBet } from '../utils/solana';
import BattleRepository from '../repositories/featuredBattle';
import { BattleStatus, NetworkType } from '../utils/enums';
import redisHandle from '../utils/redis';

// hash map to map keys to jobs
const jobMap: Map<string, cron.ScheduledTask> = new Map();

export const setupSolanaCronJobMap = async (): Promise<void> => {
    const determineJob = cron.schedule('1-59/5 * * * *', async () => {
        try {
            const battles = await BattleRepository.getBattlesByStatus(BattleStatus.Created, NetworkType.SOL);
            const battleIds = [...new Set(battles.map((item) => item.battleId))];
            console.log('determine Battle Ids', battleIds);

            for (const battleId of battleIds) {
                try {
                    await determineBet(battleId.toString());
                    await BattleRepository.updateBattleStatus(battleId, BattleStatus.Determine, NetworkType.SOL);
                } catch (error) {
                    console.log('determineBet error', error);
                }
            }
        } catch (e) {
            console.error('determineJob Error: ', e);
        }
    }, { scheduled: false }).start();

    jobMap.set('determineJob', determineJob);
};
