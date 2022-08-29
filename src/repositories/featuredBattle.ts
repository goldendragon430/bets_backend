import FeaturedBattle from '../models/featuredBattle';
import { NetworkType } from '../utils/enums';
import ProjectRepository from './project';
import { rpcProvider } from '../utils';

class FeaturedBattleRepository {
    constructor() {
    }

    getFeaturedBattles = async () => {
        return FeaturedBattle.find({});
    };

    getBattleByQuery = async (where: any) => {
        return FeaturedBattle.findOne(where);
    }

    getBattle = async (battle_id) => {
        const battle = await FeaturedBattle.findById(battle_id);
        if (!battle) {
            return undefined;
        }
        const projectL = await ProjectRepository.getProjectById(battle.projectL);
        const projectR = await ProjectRepository.getProjectById(battle.projectR);
        return Object.assign(battle.toJSON(), {
            id: battle.id,
            projectL: projectL?.toJSON(),
            projectR: projectR?.toJSON(),
        });
    };

    getActiveBattleIds = async () => {
        const blockNumber = await rpcProvider.getBlockNumber();
        const block = await rpcProvider.getBlock(blockNumber);

        const battles = await FeaturedBattle.find({
            startTime: { $lte: block.timestamp },
            endTime: { $gte: block.timestamp },
        });

        return battles.map((battle) => {
            return battle.id;
        });
    };

    getBattleHistories = async () => {
        const battles = await FeaturedBattle.find();
        const histories = await Promise.all(
            battles.map(async (item) => {
                const projectL = await ProjectRepository.getProjectById(item?.projectL);
                const projectR = await ProjectRepository.getProjectById(item?.projectR);
                return Object.assign(item.toJSON(), {
                    id: item.id,
                    projectL: projectL?.toJSON(),
                    projectR: projectR?.toJSON(),
                });
            })
        );
        return histories;
    }

    getActiveBattles = async () => {
        const battleIds = await this.getActiveBattleIds();
        return await Promise.all(
            battleIds.map(async (battleId) => {
                return await this.getBattle(battleId);
            })
        );
    };

    addBattle = async (battleId: number, startTime: number, endTime: number, projectLContract: string, projectRContract: string) => {
        const projectL = await ProjectRepository.getProjectByContract(projectLContract);
        const projectR = await ProjectRepository.getProjectByContract(projectRContract);

        const battleLength = endTime - startTime;
        const battle = new FeaturedBattle({
            startDate: new Date(startTime * 1000),
            battleId: battleId,
            startTime: startTime,
            endTime: endTime,
            battleLength: battleLength,
            projectL: projectL,
            projectR: projectR,
        });
        await battle.save();
    }

    addFeaturedBattle = async (
        startTime: number,
        battleLength: number,
        battleId: number,
        network: NetworkType,
        projectL: any,
        projectR: any,
    ) => {
        const battle = new FeaturedBattle({
            startDate: new Date(startTime * 1000),
            battleLength,
            battleId,
            network,
            projectL,
            projectR,
        });

        return battle.save();
    };
}

export default new FeaturedBattleRepository();
