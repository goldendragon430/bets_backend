import featuredBattle from '../models/featuredBattle';

class FeaturedBattleRepository {
    constructor() {}

    getFeaturedBattles = async () => {
        return featuredBattle.find({});
    }

    getActiveBattle = async () => {
        const now = new Date();
        console.log(now);
        return featuredBattle.findOne({
            startDate: { $lte: now },
            endDate: { $gte: now },
        });
    }

    addFeaturedBattle = async(
        startDate: string,
        endDate: string,
        project1: any,
        project2: any,
    ) => {
        const battle = new featuredBattle({
            startDate,
            endDate,
            project1,
            project2,
        });

        return battle.save();
    }
}

export default new FeaturedBattleRepository();
