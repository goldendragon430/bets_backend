import { Router } from 'express';
import BattleController from '../controllers/battleController';
import UserController from '../controllers/usersController';
import passport from '../utils/passport';

class FeaturedBattleRouter {
  router = Router();
  BattleController = new BattleController();
  userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route('/add').post(passport.authenticate('jwt', { session: false }), this.userController.checkAdmin, this.BattleController.addBattle);
    this.router.route('/solana/add').post(passport.authenticate('jwt', { session: false }), this.userController.checkAdmin, this.BattleController.addSolanaBattle);
    this.router.route('/get_active_battle_ids').get(this.BattleController.getActiveBattleIds);
    this.router.route('/get_battle_by_id/:battleId').get(this.BattleController.getBattle);
    this.router.route('/get_active_total_nft_staked_amount/:battleId').get(this.BattleController.getActiveTotalNftStakedAmount);
    this.router.route('/get_nft_staked_status').post(this.BattleController.getNFTStakedStatus);
    this.router.route('/get_battle_histories/:network?').get(this.BattleController.getBattleHistories);
    this.router.route('/get_battle_events/:battleId').get(this.BattleController.getBattleEvents);
    this.router.route('/get_unstake_info/:battleId').get(this.BattleController.getUnstakeInfo);
    this.router.route('/get_leaderboard').get(this.BattleController.getLeaderboard);
  }
}
export default new FeaturedBattleRouter().router;
