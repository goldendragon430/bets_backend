import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ethers } from 'ethers';
import { rpcProvider } from '../utils';
import { nftTransferFunc, nftStakedFunc, battleCreateFunc } from '../services/getEventFunc';
import { ServiceType } from '../utils/enums';
import { getBetContract } from '../utils/constants';
import battle from '../repositories/featuredBattle';
import * as ERC721ContractABI from '../abis/erc721.json';
dotenv.config();

mongoose.set('debug', true);
mongoose.connect(process.env.DB_CONFIG as string)
    .then(async () => {
        console.log('Connected to Database');

        const betContract = getBetContract();

        const getNFTTransferEvent = async (nftAddress: string) => {
            try {
                const nftContract = new ethers.Contract(nftAddress, ERC721ContractABI, rpcProvider);
                const events = await nftContract.queryFilter(nftContract.filters.Transfer());

                if (events.length > 0) {
                    for (const ev of events) {
                        if (ev.args) {
                            const from = ev.args.from;
                            const to = ev.args.to;
                            const tokenId = ev.args.tokenId;

                            await nftTransferFunc(nftAddress, from, to, tokenId, ev, ServiceType.PastEvent);
                        }
                    }
                }
                console.log(`${events.length} NFTTransfer events found on ${nftAddress}`);
            } catch (e) {
                console.log('getNFTTransferEvent error: ', e);
            }
        };

        const getNFTStakedEvent = async () => {
            try {
                const events = await betContract.queryFilter(betContract.filters.NFTStaked());

                if (events.length > 0) {
                    for (const ev of events) {
                        if (ev.args) {
                            const battleId = ev.args.battleId;
                            const collectionAddress = ev.args.collectionAddress;
                            const user = ev.args.user;
                            const tokenIds = ev.args.tokenIds;

                            await nftStakedFunc(battleId, collectionAddress, user, tokenIds, ev, ServiceType.PastEvent);
                        }
                    }
                }
                console.log(`${events.length} NFTStaked events found on ${betContract.address}`);
            } catch (e) {
                console.log('getNFTStakedEvent error: ', e);
            }
        };

        const getBattleCreateEvents = async () => {
            try {
                const events = await betContract.queryFilter(betContract.filters.NewBattleCreated());

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
            } catch (e) {
                console.log('getBattleCreateEvents error: ', e);
            }
        };

        await getNFTStakedEvent();
        await getBattleCreateEvents();

        const activeBattles = await battle.getActiveBattles();
        await Promise.all(
            activeBattles.map(async (activeBattle) => {
                if (activeBattle) {
                    await getNFTTransferEvent(activeBattle.projectL?.contract || '');
                    await getNFTTransferEvent(activeBattle.projectR?.contract || '');
                }
            })
        );

        process.exit(0);
    })
    .catch(err => {
        throw new Error(err);
    });
