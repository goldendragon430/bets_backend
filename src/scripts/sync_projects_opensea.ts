import mongoose from 'mongoose';
import 'dotenv/config';
import ProjectRepository from '../repositories/project';
import { NetworkType } from '../utils/enums';
import { getDBConfig } from '../config';
import { syncProjectFromOpensea } from '../services/getEventFunc';

const DB_CONFIG = getDBConfig();

const dbConnect = async () => {
    return mongoose.connect(DB_CONFIG)
        .then(() => console.log('Connected to Database'))
        .catch(err => {
            throw new Error(err);
        });
};

const sleep = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
};

async function main() {
    await dbConnect();
    const projects = await ProjectRepository.getProjects(NetworkType.ETH);
    for (const project of projects) {
        if (project.slug) {
            try {
                await syncProjectFromOpensea(project.slug);
                console.log(`Synced ${project.slug}`);
            } catch (e) {
                console.log(`While syncing ${project.slug} got error: ${e}`);
            }
            await sleep();
        }
    }
    process.exit(0);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
