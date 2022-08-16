import nftStaked from '../models/nftStaked';
import nftPoints from '../models/nftPoints';
import nftMetadata from '../models/nftMetadata';
import featuredBattle from '../models/featuredBattle';
import sequelize from 'sequelize';

class StakedNFTRepository {
    constructor() {
    }

    getStakedNFTs = async (project_id) => {
        const filters = [{
            project: project_id
        }];

        return nftStaked.find({$and: filters});
    };

    getStakedCountByBattle = async (battle_id) => {
        const battle = await featuredBattle.findById(battle_id);
        if (battle) {
            const project1Count = await nftStaked.find({
                attributes: [
                    'points',
                    [sequelize.fn('sum', sequelize.col('totalPoints')), 'totalPoints']
                ],
                where: {
                    project: battle.projectL,
                    battle: battle_id
                },
                group: ['totalPoints']
            });
            const project2Count = await nftStaked.find({
                attributes: [
                    'points',
                    [sequelize.fn('sum', sequelize.col('totalPoints')), 'totalPoints']
                ],
                where: {
                    project: battle.projectR,
                    battle: battle_id
                },
                group: ['totalPoints']
            });
            console.log(project1Count);
            console.log(project2Count);
        }
    }

    addNFTStaked = async (
        nft: any,
        battle: any,
        project: any,
        transactionType: string,
        multiplier: number,
        tokenType: string,
        totalPoints: number,
        walletAddress: string,
        onChainVerification: string,
    ) => {
        const stakedNFT = await nftStaked.create({
            nft,
            battle,
            project,
            transactionType,
            multiplier,
            tokenType,
            totalPoints,
            walletAddress,
            onChainVerification,
        });

        if (stakedNFT) {
            return stakedNFT;
        }
        return undefined;
    };

    addNFTPoints = async (
        battle: any,
        nft: any,
        walletAddress: string
    ) => {
        return nftPoints.create({
            battle,
            nft,
            walletAddress
        });
    };

    getNFTItem = async (nftID) => {
        return nftMetadata.findOne({nftID});
    };

    createNFTMetadata = async (name, image, address) => {
        return nftMetadata.create({
            name,
            image,
            address
        });
    }
}

export default new StakedNFTRepository();
