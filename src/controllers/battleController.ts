import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import battle from '../repositories/featuredBattle';
import project from '../repositories/project';
import stakedNFT from '../repositories/stakedNFT';
import tokenTx from '../repositories/tokenTx';
import nftActivity from '../repositories/nftActivity';

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
     * @description Get status of NFT tokenIds
     * @param req
     * @param res
     * @param next
     */
    getActiveTotalNftStakedAmount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const activeBattle = await battle.getActiveBattle();

            if (!activeBattle) {
                return res.status(400).json({'success': false, 'message': 'No active battle found.'});
            }

            const totalStakedAmount = await nftActivity.getActiveTotalNftStakedAmount(activeBattle);

            res.json({'success': true, 'message': '', 'data': totalStakedAmount});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Tx failed.');
        }
    };

    /**
     * @description Get status of NFT tokenIds
     * @param req
     * @param res
     * @param next
     */
    getNFTStakedStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tokenIds, contractAddress } = req.body;

            const status = await nftActivity.getStakedStatus(tokenIds, contractAddress);

            res.json({'success': true, 'message': '', 'data': status});
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
}
