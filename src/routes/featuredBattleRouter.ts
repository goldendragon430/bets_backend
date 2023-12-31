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
    // Management routes
    this.router.route('/add').post(passport.authenticate('jwt', { session: false }), this.userController.checkAdmin, this.BattleController.addBattle);
    this.router.route('/update_battle_active_status').post(passport.authenticate('jwt', { session: false }), this.userController.checkAdmin, this.BattleController.updateBattleActiveStatus);
    // Solana routes
    this.router.route('/solana/add').post(this.BattleController.addSolanaBattle);
    this.router.route('/solana/delete/:id').delete(this.BattleController.deleteSolanaBattle);
    this.router.route('/solana/stake').post(this.BattleController.stakeForSolana);
    this.router.route('/solana/get_live_feeds/:battleId').get(this.BattleController.getSolanaLiveFeeds);
    // this.router.route('/solana/add').post(passport.authenticate('jwt', { session: false }), this.userController.checkAdmin, this.BattleController.addSolanaBattle);
    this.router.route('/get_active_battle_ids/:network?').get(this.BattleController.getActiveBattleIds);
    this.router.route('/get_battle_by_id/:battleId').get(this.BattleController.getBattle);
    this.router.route('/get_active_total_nft_staked_amount/:battleId').get(this.BattleController.getActiveTotalNftStakedAmount);
    this.router.route('/get_nft_staked_status').post(this.BattleController.getNFTStakedStatus);
    this.router.route('/get_battle_histories/:network?/:active?').get(this.BattleController.getBattleHistories);
    this.router.route('/get_battle_events/:battleId').get(this.BattleController.getBattleEvents);
    this.router.route('/get_unstake_info/:battleId').get(this.BattleController.getUnstakeInfo);
    this.router.route('/get_leaderboard/:network?').get(this.BattleController.getLeaderboard);
  }
}
export default new FeaturedBattleRouter().router;
