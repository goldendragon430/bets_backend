import { Router } from 'express';
import ThirdPartyController from '../controllers/thirdPartyController';

class ThirdPartyRouter {
    router = Router();
    thirdPartyController = new ThirdPartyController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.route('/twitter/get').get(this.thirdPartyController.getTwitterThread);
        this.router.route('/magiceden/get/:address/:network').get(this.thirdPartyController.getMagicEdenItems);
    }
}
export default new ThirdPartyRouter().router;
