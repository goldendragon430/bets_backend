import { Router } from 'express';
import UsersController from '../controllers/usersController';

class UsersRouter {
  router = Router();
  usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.route('/get_user').get(this.usersController.getUser);
    this.router.route('/add_user').post(this.usersController.addUser);
    this.router.route('/add_wallet').post(this.usersController.addWallet);
  }
}
export default new UsersRouter().router;
