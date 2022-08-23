import FeaturedBattle from '../models/featuredBattle';
import { NetworkType } from '../utils/enums';
import ProjectRepository from './project';

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
        const now = new Date();
        const battles = await FeaturedBattle.find({
            startDate: {$lte: now},
            endDate: {$gte: now},
        });

        return battles.map((battle) => {
            return battle.id;
        });
    };

    getBattleHistories = async () => {
        const battles = await FeaturedBattle.find();
        return battles.map((item) => {
            return item.toJSON();
        });
    }

    getActiveBattles = async () => {
        const battleIds = await this.getActiveBattleIds();
        return await Promise.all(
            battleIds.map(async (battleId) => {
                return await this.getBattle(battleId);
            })
        );
    };

    addFeaturedBattle = async (
        startDate: string,
        battleLength: number,
        betContractAddress: string,
        network: NetworkType,
        projectL: any,
        projectR: any,
    ) => {
        const battle = new FeaturedBattle({
            startDate: new Date(startDate),
            battleLength,
            betContractAddress,
            network,
            projectL,
            projectR,
        });

        return battle.save();
    };
}

export default new FeaturedBattleRepository();
