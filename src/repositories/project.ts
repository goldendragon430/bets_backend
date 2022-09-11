import ProjectModel from '../models/project';
import { NetworkType } from '../utils/enums';

class ProjectRepository {
    constructor() {}

    getProjects = async (network: NetworkType) => {
        return ProjectModel.find({ network: network });
    }

    getProjectByQuery = async (where: any) => {
        return ProjectModel.findOne(where);
    }

    getProject = async (id) => {
        return ProjectModel.findOne({ _id: id });
    }

    getProjectById = async (id) => {
        return ProjectModel.findOne({ _id: id });
    }

    getProjectByContract = async (contractAddress: string) => {
        return ProjectModel.findOne({ contract: contractAddress });
    }

    addProject = async(
        name: string,
        subName: string,
        network: NetworkType,
        contract: string,
        collectionSize: number,
        twitterID: string,
        creator,
        logo: string,
        headerImage: string,
        openSeaLink: string,
        magicEdenLink: string,
        discordLink: string,
    ) => {
        const project = new ProjectModel({
            name,
            subName,
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
    }
}

export default new ProjectRepository();
