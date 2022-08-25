import { Router } from 'express';
import UsersController from '../controllers/usersController';

class UsersRouter {
  router = Router();
  usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.route('/:address').get(this.usersController.checkUser);
    this.router.route('/register').post(this.usersController.register);
    this.router.route('/:address/nonce').get(this.usersController.getNonce);
    this.router.route('/:address/signature').post(this.usersController.updateSignature);
    // this.router.route('/get_user').get(this.usersController.getUser);
    // this.router.route('/add_user').post(this.usersController.addUser);
    // this.router.route('/add_wallet').post(this.usersController.addWallet);
  }
}
export default new UsersRouter().router;
