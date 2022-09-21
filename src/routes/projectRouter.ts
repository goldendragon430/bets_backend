import { Router } from 'express';
import ProjectController from '../controllers/projectController';
import UserController from '../controllers/usersController';
import passport from '../utils/passport';

class ProjectRouter {
    router = Router();
    ProjectController = new ProjectController();
    userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.route('/get/:network?').get(this.ProjectController.getProjects);
        this.router.route('/:id').get(this.ProjectController.getProject);
        this.router.route('/add').post(passport.authenticate('jwt', { session: false }), this.userController.checkAdmin, this.ProjectController.addProject);
        this.router.route('/sync').get(passport.authenticate('jwt', { session: false }), this.userController.checkAdmin, this.ProjectController.syncProject);
    }
}
export default new ProjectRouter().router;
