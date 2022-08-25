import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { apiErrorHandler } from '../handlers/errorHandler';
import UserRepository from '../repositories/users';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export default class UsersController {
  constructor() { }

  /**
   * Validate if user registered
   * @param req
   * @param res
   * @param next
   */
  checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const { address } = req.params;
    try {
      const user = await UserRepository.getUser(address);
      return res.status(200).json({
        'success': true,
        'message': '',
        'data': user ? true : false,
      });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Check User failed.');
    }
  }

  /**
   * Validate if user registered
   * @param req
   * @param res
   * @param next
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    const { address } = req.body;
    try {
      let user = await UserRepository.getUser(address);

      if (!user) {
        user = await UserRepository.createUser(address);
      }

      return res.status(200).json({
        'success': true,
        'message': '',
        'data': user,
      });

    } catch (error) {
      apiErrorHandler(error, req, res, 'Register User failed.');
    }
  }

  /**
   * Validate if user registered
   * @param req
   * @param res
   * @param next
   */
  getNonce = async (req: Request, res: Response, next: NextFunction) => {
    const { address } = req.params;
    try {
      const user = await UserRepository.getUser(address);

      if (!user) {
        return res.status(400).json({
          'success': false,
          'message': 'User not found.',
          'data': undefined,
        });
      }

      return res.status(200).json({
        'success': true,
        'message': '',
        'data': user.nonce,
      });

    } catch (error) {
      apiErrorHandler(error, req, res, 'GetNonce failed.');
    }
  }

  /**
   * Validate if user registered
   * @param req
   * @param res
   * @param next
   */
  updateSignature = async (req: Request, res: Response, next: NextFunction) => {
    const { address } = req.params;
    const { signature } = req.body;
    try {
      const user = await UserRepository.getUser(address);

      if (!user) {
        return res.status(400).json({
          'success': false,
          'message': 'User not found.',
          'data': undefined,
        });
      }

      const msg = `Nonce: ${user.nonce}`;
      const msgHex = ethers.utils.arrayify(ethers.utils.hashMessage(msg));

      // Check if signature is valid
      const recoveredAddress = ethers.utils.recoverAddress(msgHex, signature);

      if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        user.nonce = Math.floor(Math.random() * 1000000);
        await UserRepository.updateUser(user);

        const token = jwt.sign({
          _id: user._id,
          address: user.address
        }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
          'success': true,
          'message': '',
          'data': {
            token,
            user,
          },
        });
      }

      return res.status(401).json({
        'success': false,
        'message': 'Invalid credentials',
        'data': undefined,
      });

    } catch (error) {
      console.log(error);
      apiErrorHandler(error, req, res, 'Update Signature failed.');
    }
  }

  /**
   * Get NFTs Function
   * @param req
   * @param res
   * @param next
   */
  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await UserRepository.getUser(id);
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
  addUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    const user = await UserRepository.getUser(username);

    if (user) {
      return res.status(400).json({
        'success': false,
        'message': 'User already exists.',
        'data': ''
      });
    }

    const newUser = await UserRepository.addUser(username);
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
  addWallet = async (req: Request, res: Response, next: NextFunction) => {
    const { network, address, id } = req.body;

    const user = await UserRepository.addWallet(id, network, address);
    return res.status(200).json({
      'success': true,
      'message': '',
      'data': user,
    });
  }
}
