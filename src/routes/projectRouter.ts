import { Router } from 'express';
import ProjectController from '../controllers/projectController';

class ProjectRouter {
    router = Router();
    ProjectController = new ProjectController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.route('/:network?').get(this.ProjectController.getProjects);
        this.router.route('/:id').get(this.ProjectController.getProject);
        this.router.route('/add').post(this.ProjectController.addProject);
    }
}
export default new ProjectRouter().router;
