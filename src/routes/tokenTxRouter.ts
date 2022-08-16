import { Router } from 'express';
import TokenTxController from '../controllers/tokenTxController';

class TokenTxRouter {
  router = Router();
  TokenTxController = new TokenTxController();

  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.route('/').get(this.TokenTxController.getTokenTx);
    this.router.route('/add').post(this.TokenTxController.addTx);
  }
}
export default new TokenTxRouter().router;
