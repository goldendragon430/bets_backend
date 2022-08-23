import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import BattleRepository from '../repositories/featuredBattle';
import ProjectRepository from '../repositories/project';
import nftActivityRepository from '../repositories/nftActivity';
import { installBetEventsByAddress } from '../services/events';

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
            const battles = await BattleRepository.getFeaturedBattles();

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
    getActiveBattleIds = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const activeBattleIds = await BattleRepository.getActiveBattleIds();

            res.json({'success': true, 'message': '', 'data': activeBattleIds});
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
     getBattleHistories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const battles = await BattleRepository.getBattleHistories();

            res.json({'success': true, 'message': '', 'data': battles});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Battle Histories failed.');
        }
    };

    /**
     * @description Get Battles Function
     * @param req
     * @param res
     * @param next
     */
    getBattle = async (req: Request, res: Response, next: NextFunction) => {
        const { battleId } = req.params;
        try {
            const battleInstance = await BattleRepository.getBattle(battleId as string);

            res.json({'success': true, 'message': '', 'data': battleInstance});
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
        const { battleId } = req.params;

        try {
            if (!battleId) {
                return res.status(400).json({'success': false, 'message': 'BattleId is required.'});
            }
            const battle = await BattleRepository.getBattle(battleId as string);

            if (!battle) {
                return res.status(400).json({'success': false, 'message': 'No battle found.'});
            }

            const totalStakedAmount = await nftActivityRepository.getActiveTotalNftStakedAmount(battle);

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
            const { tokenIds, contractAddress, battleId } = req.body;

            const battle = await BattleRepository.getBattle(battleId);

            if (!battle) {
                return res.status(400).json({'success': false, 'message': 'No battle found.'});
            }

            const status = await nftActivityRepository.getStakedStatus(tokenIds as Array<string>, contractAddress, battle.betContractAddress);

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
            betContractAddress,
            projectL: projectL_id,
            projectR: projectR_id,
        } = req.body;

        try {
            const projectL = await ProjectRepository.getProject(projectL_id);
            const projectR = await ProjectRepository.getProject(projectR_id);

            const battleInstance = await BattleRepository.addFeaturedBattle(
                startDate,
                endDate,
                betContractAddress,
                projectL,
                projectR,
            );

            installBetEventsByAddress(betContractAddress);

            res.json({'success': true, 'message': '', 'data': battleInstance});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Battle failed.');
        }
    };
}
