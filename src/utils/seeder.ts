import mongoose from 'mongoose';
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

const insertProjects = async () => {
    await Project.create([
        {
            '__v': 0,
            '_id': '62e3a0dbd204fdaee8f19ca7',
            'collectionSize': 10000,
            'contract': '0xb7b0D9849579D14845013ef9D8421AE58E9b9369',
            'headerImage': 'https://logo.com/header_image',
            'logo': 'https://devapp.kaminokage.com/static/media/team1.cf1efb017bef5ec722bc.png',
            'magicEdenLink': 'https://magiceden.io/marketplace/primates',
            'metadataFilter': '',
            'name': 'Primates',
            'openSeaLink': 'https://opensea.io/collection/primates-solana',
            'subName': 'Primate',
            'twitterID': 'https://twitter.com/Primatesnft',
        },
        {
            '__v': 0,
            '_id': '62e3a110d204fdaee8f19ca9',
            'collectionSize': 10000,
            'contract': '0x0c81124c1eDC6bb872864386d746b67da8Acc3F6',
            'headerImage': 'https://logo.com/header_image/trippin',
            'logo': 'https://devapp.kaminokage.com/static/media/team2.d61571560e783c335209.png',
            'magicEdenLink': 'https://magiceden.io/marketplace/trippin_ape_tribe',
            'metadataFilter': '',
            'name': "Trippin's APE TRIBE",
            'openSeaLink': 'https://opensea.io/collection/trippin-ape-tribe-solana',
            'subName': "Trippin's Ape Tribe",
            'twitterID': 'https://twitter.com/TrippinApeNFT',
        }
    ]);
};

const insertFeaturedBattles = async () => {
    await FeaturedBattle.create([
        {
            '_id': '62e94a01cc2b6a3312509a3b',
            'projectL': '62e3a0dbd204fdaee8f19ca7',
            'projectR': '62e3a110d204fdaee8f19ca9',
            'startDate': new Date('2022-07-01 00:00:00'),
            'endDate': new Date('2022-09-01 00:00:00'),
            '__v': 0
        }]);
};

async function main() {
    await dbConnect();
    await insertProjects();
    await insertFeaturedBattles();
    console.log('Seeded');
    process.exitCode = 1;
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
