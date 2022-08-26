import project from '../models/project';

class ProjectRepository {
    constructor() {}

    getProjects = async () => {
        return project.find({});
    }

    getProject = async (id) => {
        return project.findOne({ _id: id });
    }

    getProjectById = async (id) => {
        return project.findOne({ _id: id });
    }

    getProjectByContract = async (contractAddress: string) => {
        return project.findOne({ contract: contractAddress });
    }

    addProject = async(
        name: string,
        subName: string,
        contract: string,
        collectionSize: number,
        twitterID: string,
        metadataFilter: string,
        logo: string,
        headerImage: string,
        openSeaLink: string,
        magicEdenLink: string,
    ) => {
        const projectInstance = new project({
            name,
            subName,
            contract,
            collectionSize,
            twitterID,
            metadataFilter,
            logo,
            headerImage,
            openSeaLink,
            magicEdenLink,
        });

        return projectInstance.save();
    }
}

export default new ProjectRepository();
