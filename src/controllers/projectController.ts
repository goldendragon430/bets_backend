import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';

import ProjectRepository from '../repositories/project';
import { NetworkType } from '../utils/enums';

export default class ProjectController {
    constructor() { }

    /**
     * @description Get Project by ID Function
     * @param req
     * @param res
     * @param next
     */
    getProject = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        try {
            const project = await ProjectRepository.getProject(id);

            res.json({'success': true, 'message': '', 'data': project});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Project failed.');
        }
    }

    /**
     * @description Get Projects Function
     * @param req
     * @param res
     * @param next
     */
    getProjects = async (req: Request, res: Response, next: NextFunction) => {
        const { network } = req.params;

        try {
            if (network && !(network in NetworkType)) {
                return res.status(400).json({ 'success': false, 'message': 'Invalid network.' });
            }

            const projects = await ProjectRepository.getProjects(NetworkType[network] || NetworkType.ETH);

            res.json({'success': true, 'message': '', 'data': projects});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Projects failed.');
        }
    }

    /**
     * @description Add Project Function
     * @param req
     * @param res
     * @param next
     */
    addProject = async (req: Request, res: Response, next: NextFunction) => {
        const {
            name,
            subName,
            network,
            contract,
            collectionSize,
            twitterID,
            creator,
            logo,
            headerImage,
            openSeaLink,
            magicEdenLink,
            discordLink,
        } = req.body;

        try {
            if (network && !(network in NetworkType)) {
                return res.status(400).json({ 'success': false, 'message': 'Invalid network.' });
            }

            const project = await ProjectRepository.getProjectByQuery({
                name,
                network: NetworkType[network],
            });
            if (project) {
                return res.status(400).json({ 'success': false, 'message': 'Project already exists.' });
            }

            const addedProject = await ProjectRepository.addProject(
                name,
                subName,
                NetworkType[network],
                contract,
                collectionSize,
                twitterID,
                creator,
                logo,
                headerImage,
                openSeaLink,
                magicEdenLink,
                discordLink,
            );

            res.json({'success': true, 'message': '', 'data': addedProject});
        } catch (error) {
            console.log(error);
            apiErrorHandler(error, req, res, 'Add Project failed.');
        }
    }
}
