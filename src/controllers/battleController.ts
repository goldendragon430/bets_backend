import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import BattleRepository from '../repositories/featuredBattle';
import ProjectRepository from '../repositories/project';
import nftActivityRepository from '../repositories/nftActivity';
import { NetworkType } from '../utils/enums';

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
        const { } = req.body;

        try {
            const battles = await BattleRepository.getFeaturedBattles();

            res.json({ 'success': true, 'message': '', 'data': battles });
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

            res.json({ 'success': true, 'message': '', 'data': activeBattleIds });
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

            res.json({ 'success': true, 'message': '', 'data': battles });
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

            res.json({ 'success': true, 'message': '', 'data': battleInstance });
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
                return res.status(400).json({ 'success': false, 'message': 'BattleId is required.' });
            }
            const battle = await BattleRepository.getBattle(battleId as string);

            if (!battle) {
                return res.status(400).json({ 'success': false, 'message': 'No battle found.' });
            }

            const totalStakedAmount = await nftActivityRepository.getActiveTotalNftStakedAmount(battle);

            res.json({ 'success': true, 'message': '', 'data': totalStakedAmount });
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
                return res.status(400).json({ 'success': false, 'message': 'No battle found.' });
            }

            const status = await nftActivityRepository.getStakedStatus(tokenIds as Array<string>, contractAddress, battle.battleId);

            res.json({ 'success': true, 'message': '', 'data': status });
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
            startTime,
            battleLength,
            projectL: projectL_contract,
            projectR: projectR_contract,
        } = req.body;

        try {
            console.log('Authentication success');
            console.log(req);
            const projectL = await ProjectRepository.getProjectByContract(projectL_contract);
            const projectR = await ProjectRepository.getProjectByContract(projectR_contract);

            if (!projectL || !projectR) {
                return res.status(400).json({ 'success': false, 'message': 'Project is not exist.' });
            }

            if (battleLength && parseInt(battleLength) <= 0) {
                return res.status(400).json({ 'success': false, 'message': 'Battle length should be exist' });
            }

            const duplicateBattle = await BattleRepository.getBattleByQuery({
                startDate: new Date(startTime * 1000),
                battleLength: parseInt(battleLength),
                projectL: projectL._id,
                projectR: projectR._id,
            });

            if (duplicateBattle) {
                return res.status(400).json({ 'success': false, 'message': 'Battle is already exist.' });
            }

            const battleId = 0;
            const battleInstance = await BattleRepository.addFeaturedBattle(
                startTime,
                battleLength,
                battleId as number,
                NetworkType.ETH,
                projectL,
                projectR,
            );

            res.json({ 'success': true, 'message': '', 'data': battleInstance });
        } catch (error) {
            console.error(error);
            apiErrorHandler(error, req, res, 'Add Battle failed.');
        }
    };
}
