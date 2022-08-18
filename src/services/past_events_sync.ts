import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { ethers } from 'ethers';
import { rpcProvider, betContract } from '../utils';
import { nftTransferFunc, nftStakedFunc } from './getEventFunc';
import * as ERC721ContractABI from '../abis/erc721.json';
import battle from '../repositories/featuredBattle';
import project from '../repositories/project';

mongoose.set('debug', true);
mongoose.connect(process.env.DB_CONFIG as string)
    .then(async () => {
        console.log('Connected to Database');

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

                            await nftTransferFunc(nftAddress, from, to, tokenId, ev);
                        }
                    }
                }
                console.log(`${events.length} events found on ${nftAddress}`);
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
                            const collectionAddress = ev.args.collectionAddress;
                            const user = ev.args.user;
                            const tokenIds = ev.args.tokenIds;

                            await nftStakedFunc(collectionAddress, user, tokenIds, ev);
                        }
                    }
                }
            } catch (e) {
                console.log('getNFTStakedEvent error: ', e);
            }
        };

        const activeBattle = await battle.getActiveBattle();
        if (activeBattle) {
            await getNFTTransferEvent(activeBattle.projectL?.contract || '');
            await getNFTTransferEvent(activeBattle.projectR?.contract || '');
        }

        await getNFTStakedEvent();

        process.exit(0);
    })
    .catch(err => {
        throw new Error(err);
    });