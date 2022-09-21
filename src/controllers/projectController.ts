import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';

import ProjectRepository from '../repositories/project';
import { NetworkType } from '../utils/enums';
import axios from 'axios';
import Project from '../models/project';

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
            displayName,
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
                displayName,
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

    /**
     * @description Sync Project data with google sheet Function
     * @param req
     * @param res
     * @param next
     */
    syncProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sheetData = await this.googleSheetLoadFromUrl();

            const projects = sheetData.filter((item) => item.twitterID !== '' && item.contract !== '' && item.headerImage !== '');
            for (const data of projects) {
                const project = await Project.findOne({ name: data.name, network: data.network });
                if (!project) {
                    await Project.create(data);
                } else {
                    await Project.updateOne({ name: data.name, network: data.network }, data);
                }
            }

            res.json({'success': true, 'message': 'Synced the project data successfully', 'data': null});
        } catch (error) {
            console.log(error);
            apiErrorHandler(error, req, res, 'Add Project failed.');
        }
    }

    /**
     * @description Delete project data function
     * @param req
     * @param res
     * @param next
     */
    deleteProject = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const project = await ProjectRepository.getProject(id);
            if (!project) {
                return res.status(400).json({
                    'success': false,
                    'message': 'Project not found.',
                });
            }
            const isBeingUsed = await ProjectRepository.isUsingBattle(id);
            if (isBeingUsed) {
                return res.status(400).json({
                    'success': false,
                    'message': 'This project is being used in active battle.',
                });
            }
            await ProjectRepository.deleteProject(id);
            res.json({'success': true, 'message': 'Deleted Project successfully', 'data': null});
        } catch (error) {
            console.log(error);
            apiErrorHandler(error, req, res, 'Add Project failed.');
        }
    }

    googleSheetLoadFromUrl = async (sheetNameParam = 'ETH SOL List') => {
        const base = `https://docs.google.com/spreadsheets/d/1dOzbFEuQzDGw0SeHKCSyuWOYq0ogv9d7upO_KarnUK8/gviz/tq?`;
        const sheetName = sheetNameParam;
        const query = encodeURIComponent('Select *');
        const url = `${base}&sheet=${sheetName}&tq=${query}`;

        try {
            const { data: json } = await axios.get(url);
            const data: Array<any> = [];
            // Remove additional text and extract only JSON:
            const jsonData = JSON.parse(json.substring(47).slice(0, -2));

            // extract row data:
            jsonData.table.rows.forEach((rowData) => {
                const name = rowData.c[0] != undefined ? rowData.c[0].v : ''; // Project Name
                const subName = rowData.c[1] != undefined ? rowData.c[1].v : ''; // SubName
                const displayName = rowData.c[2] != undefined ? rowData.c[2].v : ''; // DisplayName
                const network = rowData.c[3] != undefined ? rowData.c[3].v : ''; // Network
                const contract = rowData.c[4] != undefined ? rowData.c[4].v : ''; // Contract Address
                const collectionSize = rowData.c[5] != undefined ? rowData.c[5].v : ''; // Collection Size
                const twitterLink = rowData.c[6] != undefined ? rowData.c[6].v : ''; // Twitter Link
                const creator = rowData.c[7] != undefined ? rowData.c[7].v : ''; // Creator
                const logoImage = rowData.c[10] != undefined ? rowData.c[10].v : ''; // Logo Image
                const headerImage = rowData.c[11] != undefined ? rowData.c[11].v : ''; // Header Image
                const openseaLink = rowData.c[12] != undefined ? rowData.c[12].v : ''; // Opensea Link
                const magicEdenLink = rowData.c[13] != undefined ? rowData.c[13].v : ''; // MagicEden link
                const discordLink = rowData.c[14] != undefined ? rowData.c[14].v : ''; // MagicEden link
                const slug = rowData.c[14] != undefined ? rowData.c[14].v : ''; // Opensea Slug

                data.push({
                    name: name,
                    subName: subName,
                    displayName: displayName,
                    network: network === 'ETH' ? NetworkType.ETH : NetworkType.SOL,
                    contract: contract,
                    collectionSize: collectionSize,
                    creator: creator,
                    twitterID: twitterLink,
                    logo: logoImage,
                    headerImage: headerImage,
                    openSeaLink: openseaLink,
                    magicEdenLink: magicEdenLink,
                    discordLink: discordLink,
                    slug: slug,
                });
            });
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };
}
