import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import users from '../repositories/users';

export default class UsersController {
  constructor() { }

  /**
   * Get NFTs Function
   * @param req
   * @param res
   * @param next
   */
  getUser = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await users.getUser(id);
    return res.status(200).json({
      'success': true,
      'message': '',
      'data': user,
    });
  }

  /**
   * Get NFTs Function
   * @param req
   * @param res
   * @param next
   */
  addUser = async(req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    const user = await users.getUser(username);

    if (user) {
      return res.status(400).json({
        'success': false,
        'message': 'User already exists.',
        'data': ''
      });
    }

    const newUser = await users.addUser(username);
    return res.status(200).json({
      'success': true,
      'message': '',
      'data': newUser,
    });
  }

  /**
   * Get NFTs Function
   * @param req
   * @param res
   * @param next
   */
  addWallet = async(req: Request, res: Response, next: NextFunction) => {
    const { network, address, id } = req.body;

    const user = await users.addWallet(id, network, address);
    return res.status(200).json({
      'success': true,
      'message': '',
      'data': user,
    });
  }
}
