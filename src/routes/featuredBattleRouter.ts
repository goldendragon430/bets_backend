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
    this.router.route('/get_nft_staked_status').post(this.BattleController.getNFTStakedStatus);
  }
}
export default new FeaturedBattleRouter().router;
