import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import BattleRepository from '../repositories/featuredBattle';
import nftActivityRepository from '../repositories/nftActivity';
import ClaimActivityRepository from '../repositories/claimActivity';
import { NetworkType } from '../utils/enums';
import { provider } from '../utils/constants';
import { BetContract } from '../utils/constants';
import { battleCreateFunc } from '../services/getEventFunc';

export default class BattleController {
    constructor() {
    }

    /**
     * @description Get Battles Function
     * @param req
     * @param res
     * @param next
     */
    getActiveBattleIds = async (req: Request, res: Response, next: NextFunction) => {
        const { network } = req.params;
        try {
            if (network && !(network in NetworkType)) {
                return res.status(400).json({ 'success': false, 'message': 'Invalid network.' });
            }
            const activeBattleIds = await BattleRepository.getActiveBattleIds(NetworkType[network] || NetworkType.ETH);

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
        const { network } = req.params;
        try {
            if (network && !(network in NetworkType)) {
                return res.status(400).json({ 'success': false, 'message': 'Invalid network.' });
            }
            const battles = await BattleRepository.getBattleHistories(NetworkType[network] || NetworkType.ETH);

            res.json({ 'success': true, 'message': '', 'data': battles });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Battle Histories failed.');
        }
    };

    /**
     * @description Get all battle events (Staked or Betted)
     * @param req
     * @param res
     * @param next
     */
    getBattleEvents = async (req: Request, res: Response, next: NextFunction) => {
        const { battleId } = req.params;

        try {
            const battles = await BattleRepository.getBattleEvents(parseInt(battleId));

            res.json({ 'success': true, 'message': '', 'data': battles });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Battle Histories failed.');
        }
    };

    /**
     * @description Get all battle events (Staked or Betted)
     * @param req
     * @param res
     * @param next
     */
     getUnstakeInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { battleId } = req.params;

        try {
            const battles = await BattleRepository.getUnstakeInfos(parseInt(battleId));

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
        const { tokenIds, side, battleId } = req.body;

        try {

            const battle = await BattleRepository.getBattle(battleId);

            if (!battle) {
                return res.status(400).json({ 'success': false, 'message': 'No battle found.' });
            }

            const status = await nftActivityRepository.getStakedStatus(tokenIds as Array<string>, side, battle.battleId);

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
            transactionHash,
            twitterID,
        } = req.body;

        try {
            if (!transactionHash) {
                return res.status(400).json({
                    'success': false,
                    'message': 'Transaction hash is required.'
                });
            }
            const transaction = await provider.getTransaction(transactionHash);
            if (!transaction) {
                return res.status(400).json({
                    'success': false,
                    'message': 'Transaction hash is required.'
                });
            }

            const blockNumber = transaction.blockNumber;
            if (!blockNumber) {
                return res.status(400).json({
                    'success': false,
                    'message': 'Block number is required.'
                });
            }
            const events = await BetContract.queryFilter(BetContract.filters.NewBattleCreated(), blockNumber, blockNumber + 1);
            if (!events || events.length === 0) {
                return res.status(400).json({
                    'success': false,
                    'message': 'No event found.'
                });
            }
            const event = events[0];
            await battleCreateFunc(event?.args?.battleId, event?.args?.startTime, event?.args?.endTime, event?.args?.teamACollectionAddress, event?.args?.teamBCollectionAddress, twitterID);

            res.json({ 'success': true, 'message': '', 'data': 'Battle created' });
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
    addSolanaBattle = async (req: Request, res: Response, next: NextFunction) => {
        const {
            startTime,
            endTime,
            projectL,
            projectR,
            twitterID,
        } = req.body;

        try {
            const battle = await BattleRepository.addSolanaBattle(startTime, endTime, projectL, projectR, twitterID);

            res.json({ 'success': true, 'message': '', 'data': battle.id });
        } catch (error) {
            console.log(error);
            apiErrorHandler(error, req, res, 'Add Battle failed.');
        }
    };

    /**
     * @description Delete Solana battle function
     * @param req
     * @param res
     * @param next
     */
    deleteSolanaBattle = async (req: Request, res: Response, next: NextFunction) => {
        const {
            id
        } = req.params;

         try {
            const battle = await BattleRepository.getBattleByQuery({
                id: id,
                network: NetworkType.SOL
            });
            if (!battle) {
                return res.status(400).json({
                    'success': false,
                    'message': 'No battle found.'
                });
            }

            const result = await BattleRepository.deleteSolanaBattle(id);

            res.json({ 'success': true, 'message': '', 'data': result });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Battle failed.');
        }
    };

    /**
     * @description Get Leaderboard Data
     * @param req
     * @param res
     * @param next
     */
    getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaderboard = await ClaimActivityRepository.getLeaderboard();

            res.json({ 'success': true, 'message': '', 'data': leaderboard });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Tx failed.');
        }
    };
}
