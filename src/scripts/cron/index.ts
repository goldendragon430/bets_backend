import { ethers } from 'ethers';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as cron from 'node-cron';
import redisHandle from '../../utils/redis';
import BattleRepository from '../../repositories/featuredBattle';
import { rpcProvider } from '../../utils';
import { battleCreateFunc, nftStakedFunc, nftTransferFunc, abpClaimedFunc } from '../../services/getEventFunc';
import { ServiceType } from '../../utils/enums';
import { getBetContract } from '../../utils/constants';
import * as ERC721ContractABI from '../../abis/erc721.json';
dotenv.config();

mongoose.set('debug', true);
mongoose.connect(process.env.DB_CONFIG as string)
    .then(async () => {
        console.log('Connected to Database');

        const betContract = getBetContract();

        try {
            await redisHandle.init();
            redisHandle.onConnect();
            redisHandle.onError();
        } catch (e) {
            console.error('redis server connection error: ', e);
        }

        const getNFTTransferEvent = async (nftAddress: string) => {
            if (!nftAddress) {
                return;
            }
            let latestBlockNumber = await rpcProvider.getBlockNumber() - 10;

            latestBlockNumber = await redisHandle.get('nftTransferBlock', latestBlockNumber);

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

                                await nftTransferFunc(nftAddress, from, to, tokenId, ev, ServiceType.Cron);
                            }
                        }
                    }
                    console.log(`${events.length} NFT Transfer events found on contract ${nftAddress}`);

                    latestBlockNumber = blockNumber;
                    await redisHandle.set('nftTransferBlock', blockNumber);
                }
                catch (e) {
                    console.log('getNFTTransferEvent error: ', e);
                }
            });
        };

        const getNFTStakedEvent = async () => {
            let latestBlockNumber = await rpcProvider.getBlockNumber() - 10;

            latestBlockNumber = await redisHandle.get('nftStakedBlock', latestBlockNumber);

            cron.schedule('* * * * *', async () => {
                try {
                    const blockNumber = await rpcProvider.getBlockNumber();

                    const events = await betContract.queryFilter(
                        betContract.filters.NFTStaked(),
                        latestBlockNumber,
                        blockNumber
                    );

                    if (events.length > 0) {
                        for (const ev of events) {
                            if (ev.args) {
                                const battleId = ev.args.battleId;
                                const collectionAddress = ev.args.collectionAddress;
                                const user = ev.args.user;
                                const tokenIds = ev.args.tokenIds;

                                await nftStakedFunc(battleId, collectionAddress, user, tokenIds, ev, ServiceType.Cron);
                            }
                        }
                    }
                    console.log(`${events.length} NFT Staked events found on contract ${betContract.address}`);

                    latestBlockNumber = blockNumber;
                    await redisHandle.set('nftStakedBlock', blockNumber);
                } catch (e) {
                    console.log('getNFTStakedEvent error: ', e);
                }
            });
        };

        const getBattleCreateEvents = async () => {
            let latestBlockNumber = await rpcProvider.getBlockNumber() - 10;

            latestBlockNumber = await redisHandle.get('battleCreateBlock', latestBlockNumber);

            cron.schedule('* * * * *', async () => {
                try {
                    const blockNumber = await rpcProvider.getBlockNumber();

                    const events = await betContract.queryFilter(
                        betContract.filters.NewBattleCreated(),
                        latestBlockNumber,
                        blockNumber
                    );

                    if (events.length > 0) {
                        for (const ev of events) {
                            if (ev.args) {
                                const battleId = ev.args.battleId;
                                const startTime = ev.args.startTime;
                                const endTime = ev.args.endTime;
                                const teamACollectionAddress = ev.args.teamACollectionAddress;
                                const teamBCollectionAddress = ev.args.teamBCollectionAddress;

                                await battleCreateFunc(battleId, startTime, endTime, teamACollectionAddress, teamBCollectionAddress);
                            }
                        }
                    }
                    console.log(`${events.length} CreatedBattle events found on ${betContract.address}`);

                    latestBlockNumber = blockNumber;
                    await redisHandle.set('battleCreateBlock', blockNumber);
                } catch (e) {
                    console.log('getBattleCreateEvents error: ', e);
                }
            });
        };

        const getABPClaimedEvent = async () => {
            let latestBlockNumber = await rpcProvider.getBlockNumber() - 10;

            latestBlockNumber = await redisHandle.get('abpClaimedBlock', latestBlockNumber);

            cron.schedule('* * * * *', async () => {
                try {
                    const blockNumber = await rpcProvider.getBlockNumber();

                    const events = await betContract.queryFilter(
                        betContract.filters.ABPClaimed(),
                        latestBlockNumber,
                        blockNumber
                    );

                    if (events.length > 0) {
                        for (const ev of events) {
                            if (ev.args) {
                                const battleId = ev.args.battleId;
                                const user = ev.args.user;
                                const amount = ev.args.amount;
            
                                await abpClaimedFunc(battleId, user, amount, ev);
                            }
                        }
                    }
                    console.log(`${events.length} ABI Claimed events found on contract ${betContract.address}`);

                    latestBlockNumber = blockNumber;
                    await redisHandle.set('abpClaimedBlock', blockNumber);
                } catch (e) {
                    console.log('getABPClaimedEvent error: ', e);
                }
            });
        };

        await getNFTStakedEvent();
        await getBattleCreateEvents();
        await getABPClaimedEvent();

        const activeBattles = await BattleRepository.getActiveBattles();
        const nftContractAddresses: Array<string> = [];
        activeBattles.map(async (activeBattle) => {
            if (activeBattle) {
                nftContractAddresses.push(activeBattle.projectL?.contract || '');
                nftContractAddresses.push(activeBattle.projectR?.contract || '');
            }
        });
        const uniqueNFTAddresses = [...new Set(nftContractAddresses.filter((item) => item !== ''))];
        uniqueNFTAddresses.map(async (nftAddress) => {
            await getNFTTransferEvent(nftAddress);
        });

    })
    .catch(err => {
        throw new Error(err);
    });
