import { Router } from 'express';
import StakedNFTController from '../controllers/stakedNFTController';

class StakedNFTRouter {
    router = Router();
    stakedNFTController = new StakedNFTController();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.route('/get_staked_nfts/:id').get(this.stakedNFTController.getStakedNFTs);
        this.router.route('/add_staked_nft').post(this.stakedNFTController.addStakedNFT);
    }
}
export default new StakedNFTRouter().router;
