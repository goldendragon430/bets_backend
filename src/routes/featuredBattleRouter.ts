import { Router } from 'express';
import BattleController from '../controllers/battleController';
import passport from '../utils/passport';

class FeaturedBattleRouter {
  router = Router();
  BattleController = new BattleController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route('/add').post(passport.authenticate('jwt', { session: false }), this.BattleController.addBattle);
    this.router.route('/get_active_battle_ids').get(this.BattleController.getActiveBattleIds);
    this.router.route('/get_battle_by_id/:battleId').get(this.BattleController.getBattle);
    this.router.route('/get_active_total_nft_staked_amount/:battleId').get(this.BattleController.getActiveTotalNftStakedAmount);
    this.router.route('/get_nft_staked_status').post(this.BattleController.getNFTStakedStatus);
    this.router.route('/get_battle_histories').get(this.BattleController.getBattleHistories);
  }
}
export default new FeaturedBattleRouter().router;
