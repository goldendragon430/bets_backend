import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import * as cron from 'node-cron';
import { ethers } from 'ethers';
import redisHandle from '../utils/redis';
import { rpcProvider, betContract } from '../utils';
import { nftTransferFunc } from '../services/getEventFunc';
import * as ERC721ContractABI from '../abis/erc721.json';
import battle from '../repositories/featuredBattle';
import project from '../repositories/project';

mongoose.set('debug', true);
mongoose.connect(process.env.DB_CONFIG as string)
    .then(async () => {
        console.log('Connected to Database');
        let redisClient;

        try {
            await redisHandle.init();
            redisHandle.onConnect();
            redisHandle.onError();

            redisClient = redisHandle.getRedisClient();
        } catch (e) {
            console.error('redis server connection error: ', e);
        }

        const getNFTTransferEvent = async (nftAddress: string) => {
            // let latestBlockNumber = await rpcProvider.getBlockNumber() - 10;
            let latestBlockNumber = 11171719;

            try {
                const res = await redisClient.get('nftTransferBlock');

                if (res == undefined) {
                    await redisClient.set('nftTransferBlock', latestBlockNumber);
                } else {
                    latestBlockNumber = parseInt(res);
                }
            } catch (e) {
                console.error('redis server error: ', e);
            }

            try {
                const blockNumber = await rpcProvider.getBlockNumber();
                console.log(nftAddress);
                const nftContract = new ethers.Contract(nftAddress, ERC721ContractABI, rpcProvider);
                const events = await nftContract.queryFilter(
                    nftContract.filters.Transfer()
                );
                console.log(events);
                if (events.length > 0) {
                    for (const ev of events) {
                        if (ev.args) {
                            const from = ev.args.from;
                            const to = ev.args.to;
                            const tokenId = ev.args.tokenId;

                            await nftTransferFunc(nftAddress, from, to, tokenId, ev);
                        }
                    }
                }

                latestBlockNumber = blockNumber;
                await redisClient.set('nftTransferBlock', blockNumber);
            }
            catch (e) {
                console.log('getNFTTransferEvent error: ', e);
            }
            // cron.schedule('* * * * *', async () => {
            //     try {
            //         const blockNumber = await rpcProvider.getBlockNumber();
            //         console.log(nftAddress);
            //         const nftContract = new ethers.Contract(nftAddress, ERC721ContractABI, rpcProvider);
            //         const events = await nftContract.queryFilter(
            //             nftContract.filters.Transfer()
            //         );
            //         console.log(events);
            //         if (events.length > 0) {
            //             for (const ev of events) {
            //                 if (ev.args) {
            //                     const from = ev.args.from;
            //                     const to = ev.args.to;
            //                     const tokenId = ev.args.id;
            //
            //                     await nftTransferFunc(from, to, tokenId, ev);
            //                 }
            //             }
            //         }
            //
            //         latestBlockNumber = blockNumber;
            //         await redisClient.set('nftTransferBlock', blockNumber);
            //     }
            //     catch (e) {
            //         console.log('getNFTTransferEvent error: ', e);
            //     }
            // });
        };

        const activeBattle = await battle.getActiveBattle();
        console.log(activeBattle);
        if (activeBattle) {
            const projectL = await project.getProject(activeBattle.projectL);
            const projectR = await project.getProject(activeBattle.projectR);
            if (projectL?.contract) {
                await getNFTTransferEvent(projectL?.contract);
            }
            if (projectR?.contract) {
                await getNFTTransferEvent(projectR?.contract);
            }
        }
    })
    .catch(err => {
        throw new Error(err);
    });
