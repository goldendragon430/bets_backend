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
            'collectionSize': 19425,
            'contract': '0x036D48B9d40758EaA075482fFfa58D1cE3F90bD0',
            'headerImage': 'https://lh3.googleusercontent.com/5c-HcdLMinTg3LvEwXYZYC-u5nN22Pn5ivTPYA4pVEsWJHU1rCobhUlHSFjZgCHPGSmcGMQGCrDCQU8BfSfygmL7Uol9MRQZt6-gqA=s2500',
            'logo': 'https://lh3.googleusercontent.com/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcUPFoG53VnLJezYi8hAs0OxNZwlw6Y-dmI',
            'magicEdenLink': '',
            'name': 'Mutant Ape Yacht Club',
            'openSeaLink': 'https://opensea.io/collection/mutant-ape-yacht-club',
            'subName': 'MAYC',
            'twitterID': 'https://twitter.com/yugalabs',
        },
        {
            '__v': 0,
            '_id': '62e3a110d204fdaee8f19ca9',
            'collectionSize': 10000,
            'contract': '0x5E8569023518E3B88304df25329a4DA4f59F1124',
            'headerImage': 'https://lh3.googleusercontent.com/O0XkiR_Z2--OPa_RA6FhXrR16yBOgIJqSLdHTGA0-LAhyzjSYcb3WEPaCYZHeh19JIUEAUazofVKXcY2qOylWCdoeBN6IfGZLJ3I4A=s2500',
            'logo': 'https://lh3.googleusercontent.com/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT',
            'magicEdenLink': '',
            'name': 'Azuki',
            'openSeaLink': 'https://opensea.io/collection/azuki',
            'subName': 'Azuki',
            'twitterID': 'https://twitter.com/azukiofficial',
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
