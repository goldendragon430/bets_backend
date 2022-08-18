import { Router } from 'express';
import BattleController from '../controllers/battleController';

class FeaturedBattleRouter {
  router = Router();
  BattleController = new BattleController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // this.router.route('/').get(this.BattleController.getBattles);
    // this.router.route('/add').post(this.BattleController.addBattle);
    this.router.route('/get_active_battle').get(this.BattleController.getActiveBattle);
    this.router.route('/get_battle_by_id/:battleId').get(this.BattleController.getBattle);
    this.router.route('/get_active_total_nft_staked_amount/:battleId').get(this.BattleController.getActiveTotalNftStakedAmount);
    this.router.route('/get_nft_staked_status').post(this.BattleController.getNFTStakedStatus);
  }
}
export default new FeaturedBattleRouter().router;
