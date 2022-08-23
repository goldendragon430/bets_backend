import mongoose from 'mongoose';
import axios from 'axios';
import Project from '../models/project';
import FeaturedBattle from '../models/featuredBattle';
import 'dotenv/config';

const dbConnect = async () => {
    return mongoose.connect(process.env.DB_CONFIG as string)
        .then(() => console.log('Connected to Database'))
        .catch(err => {
            throw new Error(err);
        });
};

const googleSheetLoadfromUrl = async (sheetNameParam = "Eth Projects - Updated") => {
    const base = `https://docs.google.com/spreadsheets/d/1dOzbFEuQzDGw0SeHKCSyuWOYq0ogv9d7upO_KarnUK8/gviz/tq?`;
    const sheetName = sheetNameParam;
    const query = encodeURIComponent("Select *");
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    try {
        const { data: json } = await axios.get(url);
        const data: Array<any> = [];
        //Remove additional text and extract only JSON:
        const jsonData = JSON.parse(json.substring(47).slice(0, -2));

        //extract row data:
        jsonData.table.rows.forEach((rowData) => {
            const name = rowData.c[0] != null ? rowData.c[0].v : "";
            const subName = rowData.c[1] != null ? rowData.c[1].v : "";
            const collectionSize = rowData.c[3] != null ? rowData.c[3].v : "";
            const openseaLink = rowData.c[6] != null ? rowData.c[6].v : "";
            const twitterLink = rowData.c[7] != null ? rowData.c[7].v : "";
            const headerImage = rowData.c[8] != null ? rowData.c[8].v : "";
            const logoImage = rowData.c[9] != null ? rowData.c[9].v : "";
            const contractAddress = rowData.c[10] != null ? rowData.c[10].v : "";
            const bannerImage = rowData.c[11] != null ? rowData.c[11].v : "";

            data.push({
                name: name,
                subName: subName,
                contract: contractAddress,
                collectionSize: collectionSize,
                twitterID: twitterLink,
                logo: logoImage,
                headerImage: headerImage,
                openSeaLink: openseaLink,
            });
        });
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const insertProjects = async (datas) => {
    await Project.create(datas);
};

async function main() {
    await dbConnect();
    const dataFromSheet = await googleSheetLoadfromUrl();
    console.log(dataFromSheet)
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
