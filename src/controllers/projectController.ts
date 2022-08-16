import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';

import project from '../repositories/project';

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
            const projects = await project.getProject(id);

            res.json({'success': true, 'message': '', 'data': projects});
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
        const { } = req.body;

        try {
            const projects = await project.getProjects();

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
            contract,
            collectionSize,
            twitterID,
            metadataFilter,
            logo,
            headerImage,
            openSeaLink,
            magicEdenLink,
        } = req.body;

        try {
            const temp = await project.addProject(
                name,
                subName,
                contract,
                collectionSize,
                twitterID,
                metadataFilter,
                logo,
                headerImage,
                openSeaLink,
                magicEdenLink,
            );

            res.json({'success': true, 'message': '', 'data': temp});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Project failed.');
        }
    }
}
