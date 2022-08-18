import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import * as cron from 'node-cron';
import { ethers } from 'ethers';
import redisHandle from '../utils/redis';
import { rpcProvider, betContract } from '../utils';
import { nftStakedFunc, nftTransferFunc } from '../services/getEventFunc';
import * as ERC721ContractABI from '../abis/erc721.json';
import battle from '../repositories/featuredBattle';
import project from '../repositories/project';
import { CONTRACT } from '../config';
import * as BetContractAbi from '../abis/BetABI.json';

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
            if (!nftAddress) {
                return;
            }
            let latestBlockNumber = await rpcProvider.getBlockNumber() - 10;

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

            // Monitoring NFT transfer events for collectionA and collectionB
            cron.schedule('* * * * *', async () => {
                try {
                    const blockNumber = await rpcProvider.getBlockNumber();

                    const nftContract = new ethers.Contract(nftAddress, ERC721ContractABI, rpcProvider);
                    const events = await nftContract.queryFilter(
                        nftContract.filters.Transfer(),
                        latestBlockNumber,
                        blockNumber
                    );

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
                    console.log(`${events.length} NFT Transfer events found on contract ${nftAddress}`);

                    latestBlockNumber = blockNumber;
                    await redisClient.set('nftTransferBlock', blockNumber);
                }
                catch (e) {
                    console.log('getNFTTransferEvent error: ', e);
                }
            });
        };

        const getNFTStakedEvent = async (betContractAddress) => {
            let latestBlockNumber = await rpcProvider.getBlockNumber() - 10;

            try {
                const res = await redisClient.get('nftStakedBlock');

                if (res == undefined) {
                    await redisClient.set('nftStakedBlock', latestBlockNumber);
                } else {
                    latestBlockNumber = parseInt(res);
                }
            } catch (e) {
                console.error('redis server error: ', e);
            }

            cron.schedule('* * * * *', async () => {
                try {
                    const blockNumber = await rpcProvider.getBlockNumber();

                    const betContract = new ethers.Contract(betContractAddress, BetContractAbi, rpcProvider);
                    const events = await betContract.queryFilter(
                        betContract.filters.NFTStaked(),
                        latestBlockNumber,
                        blockNumber
                    );

                    if (events.length > 0) {
                        for (const ev of events) {
                            if (ev.args) {
                                const collectionAddress = ev.args.collectionAddress;
                                const user = ev.args.user;
                                const tokenIds = ev.args.tokenIds;

                                await nftStakedFunc(collectionAddress, user, tokenIds, ev, betContractAddress);
                            }
                        }
                    }
                    console.log(`${events.length} NFT Staked events found on contract ${betContract.address}`);

                    latestBlockNumber = blockNumber;
                    await redisClient.set('nftStakedBlock', blockNumber);
                } catch (e) {
                    console.log('getNFTStakedEvent error: ', e);
                }
            });
        };

        const activeBattle = await battle.getActiveBattle();
        if (activeBattle) {
            await getNFTTransferEvent(activeBattle.projectL?.contract || '');
            await getNFTTransferEvent(activeBattle.projectR?.contract || '');
            await getNFTStakedEvent(activeBattle.betContractAddress);
        }
    })
    .catch(err => {
        throw new Error(err);
    });
