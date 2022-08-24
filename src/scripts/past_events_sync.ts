import * as dotenv from 'dotenv';

dotenv.config();
import mongoose from 'mongoose';
import { ethers } from 'ethers';
import { rpcProvider } from '../utils';
import { nftTransferFunc, nftStakedFunc } from '../services/getEventFunc';
import * as ERC721ContractABI from '../abis/erc721.json';
import battle from '../repositories/featuredBattle';
import * as BetContractAbi from '../abis/BetABI.json';
import { ServiceType } from '../utils/enums';

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

                            await nftTransferFunc(nftAddress, from, to, tokenId, ev, ServiceType.PastEvent);
                        }
                    }
                }
                console.log(`${events.length} NFTTransfer events found on ${nftAddress}`);
            } catch (e) {
                console.log('getNFTTransferEvent error: ', e);
            }
        };

        const getNFTStakedEvent = async (betContractAddress) => {
            try {
                const betContract = new ethers.Contract(betContractAddress, BetContractAbi, rpcProvider);
                const events = await betContract.queryFilter(betContract.filters.NFTStaked());

                if (events.length > 0) {
                    for (const ev of events) {
                        if (ev.args) {
                            const collectionAddress = ev.args.collectionAddress;
                            const user = ev.args.user;
                            const tokenIds = ev.args.tokenIds;

                            await nftStakedFunc(collectionAddress, user, tokenIds, ev, betContractAddress, ServiceType.PastEvent);
                        }
                    }
                }
                console.log(`${events.length} NFTStaked events found on ${betContractAddress}`);
            } catch (e) {
                console.log('getNFTStakedEvent error: ', e);
            }
        };

        const activeBattles = await battle.getActiveBattles();
        await Promise.all(
            activeBattles.map(async (activeBattle) => {
                if (activeBattle) {
                    await getNFTTransferEvent(activeBattle.projectL?.contract || '');
                    await getNFTTransferEvent(activeBattle.projectR?.contract || '');
                    await getNFTStakedEvent(activeBattle.betContractAddress);
                }
            })
        );

        process.exit(0);
    })
    .catch(err => {
        throw new Error(err);
    });
