import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { ethers } from 'ethers';
import { rpcProvider } from '../utils';
import { nftTransferFunc } from './getEventFunc';
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
                const events = await nftContract.queryFilter(
                    nftContract.filters.Transfer()
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
            }
            catch (e) {
                console.log('getNFTTransferEvent error: ', e);
            }
        };

        const activeBattle = await battle.getActiveBattle();
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
