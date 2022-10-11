import ProjectModel from '../models/project';
import FeaturedBattleRepository from './featuredBattle';
import { NetworkType } from '../utils/enums';
import * as path from 'path';
import * as fs from 'fs';

class ProjectRepository {
    constructor() {
    }

    getProjects = async (network: NetworkType) => {
        return ProjectModel.find({network: network});
    };

    getProjectByQuery = async (where: any) => {
        return ProjectModel.findOne(where);
    };

    getProject = async (id) => {
        return ProjectModel.findOne({_id: id});
    };

    getProjectById = async (id) => {
        return ProjectModel.findOne({_id: id});
    };

    getProjectByContract = async (contractAddress: string) => {
        return ProjectModel.findOne({contract: contractAddress});
    };

    updateProjectBySlug = async (slug: string, floor_price: number, num_owners: number) => {
        return ProjectModel.updateOne(
            {slug: slug},
            {$set: {floor_price: floor_price, num_owners: num_owners}},
        );
    };

    updateProjectById = async (
        id: string,
        name: string,
        subName: string,
        displayName: string,
        network: NetworkType,
        contract: string,
        collectionSize: number,
        twitterID: string,
        creator: string,
        logo: string,
        headerImage: string,
        openSeaLink: string,
        magicEdenLink: string,
        discordLink: string,
    ) => {
        return ProjectModel.updateOne(
            {_id: id},
            {
                $set: {
                    name,
                    subName,
                    displayName,
                    network,
                    contract,
                    collectionSize,
                    twitterID,
                    creator,
                    logo,
                    headerImage,
                    openSeaLink,
                    magicEdenLink,
                    discordLink,
                },
            },
        );
    };

    addProject = async (
        name: string,
        subName: string,
        displayName: string,
        network: NetworkType,
        contract: string,
        collectionSize: number,
        twitterID: string,
        creator: string,
        logo: string,
        headerImage: string,
        openSeaLink: string,
        magicEdenLink: string,
        discordLink: string,
    ) => {
        const project = new ProjectModel({
            name,
            subName,
            displayName,
            network,
            contract,
            collectionSize,
            twitterID,
            creator,
            logo,
            headerImage,
            openSeaLink,
            magicEdenLink,
            discordLink,
        });

        return project.save();
    };

    isUsingBattle = async (id: string): Promise<boolean> => {
        const activeBattles = await FeaturedBattleRepository.getActiveBattles();
        return activeBattles.filter((battle) => (battle.projectL.id.toString() === id || battle.projectR.id.toString() === id)).length > 0;
    };

    deleteProject = async (id: string) => {
        return ProjectModel.deleteOne({_id: id});
    };

    validateInHashMintList = async (mintHashListPath: string, hash: string): Promise<boolean> => {
        const jsonPath = path.resolve(__dirname, '../static/HashListJSON', mintHashListPath);
        const content = fs.readFileSync(jsonPath);
        const data = JSON.parse(content.toString());
        return data.filter((item) => item === hash).length > 0;
    }
}

export default new ProjectRepository();
