import { Router } from 'express';
import BattleController from '../controllers/battleController';

class FeaturedBattleRouter {
  router = Router();
  BattleController = new BattleController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route('/').get(this.BattleController.getBattles);
    this.router.route('/add').post(this.BattleController.addBattle);
    this.router.route('/get_active_battle').get(this.BattleController.getActiveBattle);
    this.router.route('/get_project_points').get(this.BattleController.getProjectPoints);

    this.router.route('/join').post(this.BattleController.joinBattle);
    this.router.route('/boost').post(this.BattleController.boostBattle);
  }
}
export default new FeaturedBattleRouter().router;
