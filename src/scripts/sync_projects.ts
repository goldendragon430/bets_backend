import mongoose from 'mongoose';
import axios from 'axios';
import Project from '../models/project';
import 'dotenv/config';
import { NetworkType } from '../utils/enums';
import { getDBConfig } from '../config';

const DB_CONFIG = getDBConfig();

const dbConnect = async () => {
    return mongoose.connect(DB_CONFIG)
        .then(() => console.log('Connected to Database'))
        .catch(err => {
            throw new Error(err);
        });
};

const googleSheetLoadfromUrl = async (sheetNameParam = 'ETH SOL List') => {
    const base = `https://docs.google.com/spreadsheets/d/1dOzbFEuQzDGw0SeHKCSyuWOYq0ogv9d7upO_KarnUK8/gviz/tq?`;
    const sheetName = sheetNameParam;
    const query = encodeURIComponent('Select *');
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    try {
        const { data: json } = await axios.get(url);
        const data: Array<any> = [];
        // Remove additional text and extract only JSON:
        const jsonData = JSON.parse(json.substring(47).slice(0, -2));

        // extract row data:
        jsonData.table.rows.forEach((rowData) => {
            const name = rowData.c[0] != undefined ? rowData.c[0].v : ''; // Project Name
            const subName = rowData.c[1] != undefined ? rowData.c[1].v : ''; // SubName
            const displayName = rowData.c[2] != undefined ? rowData.c[2].v : ''; // SubName
            const network = rowData.c[3] != undefined ? rowData.c[3].v : ''; // Network
            const contract = rowData.c[4] != undefined ? rowData.c[4].v : ''; // Contract Address
            const collectionSize = rowData.c[5] != undefined ? rowData.c[5].v : ''; // Collection Size
            const twitterLink = rowData.c[6] != undefined ? rowData.c[6].v : ''; // Twitter Link
            const creator = rowData.c[7] != undefined ? rowData.c[7].v : ''; // Creator
            const logoImage = rowData.c[10] != undefined ? rowData.c[10].v : ''; // Logo Image
            const headerImage = rowData.c[11] != undefined ? rowData.c[11].v : ''; // Header Image
            const openseaLink = rowData.c[12] != undefined ? rowData.c[12].v : ''; // Opensea Link
            const magicEdenLink = rowData.c[13] != undefined ? rowData.c[13].v : ''; // MagicEden link
            const discordLink = rowData.c[14] != undefined ? rowData.c[14].v : ''; // MagicEden link

            data.push({
                name: name,
                subName: subName,
                displayName: displayName,
                network: network === 'ETH' ? NetworkType.ETH : NetworkType.SOL,
                contract: contract,
                collectionSize: collectionSize,
                creator: creator,
                twitterID: twitterLink,
                logo: logoImage,
                headerImage: headerImage,
                openSeaLink: openseaLink,
                magicEdenLink: magicEdenLink,
                discordLink: discordLink,
            });
        });
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const insertProjects = async (datas) => {
    const projects = datas.filter((item) => item.twitterID !== '' && item.contract !== '' && item.headerImage !== '');
    for (const data of projects) {
        const project = await Project.findOne({ name: data.name });
        if (!project) {
            await Project.create(data);
        } else {
            await Project.updateOne({ name: data.name }, { displayName: data.displayName });
        }
    }
};

async function main() {
    await dbConnect();
    const dataFromSheet = await googleSheetLoadfromUrl();
    console.log(dataFromSheet);
    await insertProjects(dataFromSheet);
    console.log('Seeded projects');
    process.exit(1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
