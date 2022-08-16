import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import battle from '../repositories/featuredBattle';
import project from '../repositories/project';
import stakedNFT from '../repositories/stakedNFT';
import tokenTx from '../repositories/tokenTx';

export default class BattleController {
    constructor() {
    }

    /**
     * @description Get Battles Function
     * @param req
     * @param res
     * @param next
     */
    getBattles = async (req: Request, res: Response, next: NextFunction) => {
        const {} = req.body;

        try {
            const battles = await battle.getFeaturedBattles();

            res.json({'success': true, 'message': '', 'data': battles});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Tx failed.');
        }
    };

    /**
     * @description Get Battles Function
     * @param req
     * @param res
     * @param next
     */
    getActiveBattle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const activeBattle = await battle.getActiveBattle();

            res.json({'success': true, 'message': '', 'data': activeBattle});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Tx failed.');
        }
    };

    /**
     * @description Get Project points Function
     * @param req
     * @param res
     * @param next
     */
    getProjectPoints = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const activeBattle = await battle.getActiveBattle();

            if (!activeBattle) {
                return res.status(400).json({
                    'success': false,
                    'message': 'No active battle',
                    'data': '',
                });
            }

            await stakedNFT.getStakedCountByBattle(activeBattle.id);

            res.json({'success': true, 'message': '', 'data': activeBattle});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Tx failed.');
        }
    };

    /**
     * @description Add Battle Function
     * @param req
     * @param res
     * @param next
     */
    addBattle = async (req: Request, res: Response, next: NextFunction) => {
        const {
            startDate,
            endDate,
            project1: project1_id,
            project2: project2_id,
        } = req.body;

        try {
            const project1 = await project.getProject(project1_id);
            const project2 = await project.getProject(project2_id);

            const battleInstance = await battle.addFeaturedBattle(
                startDate,
                endDate,
                project1,
                project2,
            );

            res.json({'success': true, 'message': '', 'data': battleInstance});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Battle failed.');
        }
    };

    /**
     * @description Add Battle Function
     * @param req
     * @param res
     * @param next
     */
    joinBattle = async (req: Request, res: Response, next: NextFunction) => {
        const { nftName, nftImage, nftAddress, wallet, network, projectId } = req.body;

        try {
            const activeBattle = await battle.getActiveBattle();
            if (!activeBattle) {
                return res.status(400).json({
                    'success': false,
                    'message': 'No active battle',
                    'data': '',
                });
            }

            const nft = await stakedNFT.createNFTMetadata(nftName, nftImage, nftAddress);

            const projectInstance = await project.getProject(projectId);
            const nftStakedCreated = await stakedNFT.addNFTStaked(
                nft,
                projectInstance,
                activeBattle,
                'stake',
                1,
                'NFT',
                100,
                `${network}_${wallet}`,
                'onChain'
            );

            await stakedNFT.addNFTPoints(activeBattle, nft, `${network}_${wallet}`);

            res.json({'success': true, 'message': '', 'data': nftStakedCreated});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Battle failed.');
        }
    };

    /**
     * @description Add Battle Function
     * @param req
     * @param res
     * @param next
     */
    boostBattle = async (req: Request, res: Response, next: NextFunction) => {
        const { projectId, txType, multiplier, tokenType, totalPoints, chainType, claimableTime, wallet, network } = req.body;

        try {
            const activeBattle = await battle.getActiveBattle();
            if (!activeBattle) {
                return res.status(400).json({
                    'success': false,
                    'message': 'No active battle',
                    'data': '',
                });
            }
            if (txType !== 'Stake' && txType !== 'Burn') {
                return res.status(400).json({
                    'success': false,
                    'message': 'Transaction Type is not valid',
                    'data': '',
                });
            }
            if (chainType !== 'on' && chainType !== 'off') {
                return res.status(400).json({
                    'success': false,
                    'message': 'Chain Type is not valid',
                    'data': '',
                });
            }

            const projectInstance = await project.getProject(projectId);
            const tokenTxCreated = await tokenTx.addTokenTx(
                activeBattle,
                projectInstance,
                txType,
                multiplier,
                tokenType,
                totalPoints,
                chainType,
                claimableTime,
                `${network}_${wallet}`,
                'onChain'
            );

            res.json({'success': true, 'message': '', 'data': tokenTxCreated});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Battle failed.');
        }
    };
}
