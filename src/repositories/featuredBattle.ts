import FeaturedBattle from '../models/featuredBattle';
import ProjectRepository from './project';

class FeaturedBattleRepository {
    constructor() {}

    getFeaturedBattles = async () => {
        return FeaturedBattle.find({});
    }

    getBattle = async (battle_id) => {
        const battle = await FeaturedBattle.findOne({
            id: battle_id
        });
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
    }

    getActiveBattle = async () => {
        const now = new Date();
        const battle = await FeaturedBattle.findOne({
            startDate: { $lte: now },
            endDate: { $gte: now },
        });
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
    }

    addFeaturedBattle = async(
        startDate: string,
        endDate: string,
        projectL: any,
        projectR: any,
    ) => {
        const battle = new FeaturedBattle({
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            projectL,
            projectR,
        });

        return battle.save();
    }
}

export default new FeaturedBattleRepository();
