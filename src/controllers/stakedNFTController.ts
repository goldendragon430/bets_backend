import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import stakedNFT from '../repositories/stakedNFT';
import projectRepo from '../repositories/project';

export default class StakedNFTController {
    constructor() {
    }

    /**
     * Get NFTs Function
     * @param req
     * @param res
     * @param next
     */
    getStakedNFTs = async (req: Request, res: Response, next: NextFunction) => {
        const {id: project_id} = req.params;
        const nft = await stakedNFT.getStakedNFTs(project_id);
        return res.status(200).json({
            'success': true,
            'message': '',
            'data': nft,
        });
    };

    /**
     * Get NFTs Function
     * @param req
     * @param res
     * @param next
     */
    addStakedNFT = async (req: Request, res: Response, next: NextFunction) => {
        const {
            nftID,
            projectID,
            transactionType,
            multiplier,
            tokenType,
            totalPoints,
            walletAddress,
            onChainVerification,
        } = req.body;

        try {
            const project = await projectRepo.getProject(projectID);
            if (!project) {
                return res.status(404).json({
                    'success': false,
                    'message': 'Project not found',
                    'data': projectID
                });
            }
            const stakedInfo = await stakedNFT.addNFTStaked(
                nftID,
                project,
                transactionType,
                multiplier,
                tokenType,
                totalPoints,
                walletAddress,
                onChainVerification,
                onChainVerification,
            );

            return res.status(200).json({
                'success': true,
                'message': '',
                'data': stakedInfo,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Staked NFT failed.');
        }
    };
}
