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

    updateProject = async (slug: string, floor_price: number, num_owners: number) => {
        return ProjectModel.updateOne(
            { slug: slug },
            { $set: { floor_price: floor_price, num_owners: num_owners } },
        );
    }

    addProject = async(
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
    }
}

export default new ProjectRepository();
