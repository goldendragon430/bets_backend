import { ethers } from 'ethers';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { apiErrorHandler } from '../handlers/errorHandler';
import UserRepository from '../repositories/users';
import { JWT_CONFIG } from '../config';

export default class UsersController {
    constructor() {
    }

    /**
     * Validate if user registered
     * @param req
     * @param res
     * @param next
     */
    checkUser = async (req: Request, res: Response, next: NextFunction) => {
        const {address} = req.params;
        try {
            const user = await UserRepository.getUser(address);
            return res.status(200).json({
                'success': true,
                'message': '',
                'data': !!user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Check User failed.');
        }
    };

    /**
     * Validate if user registered
     * @param req
     * @param res
     * @param next
     */
    register = async (req: Request, res: Response, next: NextFunction) => {
        const {address} = req.body;

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
    };

    /**
     * Validate if user registered
     * @param req
     * @param res
     * @param next
     */
    getNonce = async (req: Request, res: Response, next: NextFunction) => {
        const {address} = req.params;
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
    };

    /**
     * Validate if user registered
     * @param req
     * @param res
     * @param next
     */
    updateSignature = async (req: Request, res: Response, next: NextFunction) => {
        const {address} = req.params;
        const {signature} = req.body;
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
                }, JWT_CONFIG.secret, {expiresIn: '24h'});

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
    };

    /**
     * @description Get user information Function
     * @param req
     * @param res
     * @param next
     */
    getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const user = await UserRepository.getUserById(req.user?.id);

            return res.json({'success': true, 'message': 'Get user', 'data': user});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get user information failed.');
        }
    };

    /**
     * @description Get user information Function
     * @param req
     * @param res
     * @param next
     */
    checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const user = await UserRepository.getUserById(req.user?.id);

            if (user?.isAdmin) {
                return next();
            }
            return res.status(401).json({
                'success': false,
                'message': 'You are not authorized to access this resource',
                'data': undefined,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get user information failed.');
        }
    };

    /**
     * Get NFTs Function
     * @param req
     * @param res
     * @param next
     */
    addUser = async (req: Request, res: Response, next: NextFunction) => {
        const {username} = req.body;

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
    };

    /**
     * Get User data Function
     * @param req
     * @param res
     * @param next
     */
    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        const {address} = req.params;

        try {
            if (!ethers.utils.isAddress(address)) {
                return res.status(400).json({
                    'success': false,
                    'message': 'Invalid address.',
                    'data': ''
                });
            }
            const user = await UserRepository.getUserProfile(address);

            return res.status(200).json({
                'success': true,
                'message': '',
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get User profile failed.');
        }
    };

    /**
     * Update Profile Function
     * @param req
     * @param res
     * @param next
     */
    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        const {address} = req.params;
        const {username, contract, tokenId, image} = req.body;

        try {
            if (!ethers.utils.isAddress(address)) {
                return res.status(400).json({
                    'success': false,
                    'message': 'Invalid address.',
                    'data': ''
                });
            }
            const user = await UserRepository.getUser(address);
            if (!user) {
                return res.status(400).json({
                    'success': false,
                    'message': 'User not found.',
                    'data': ''
                });
            }

            await UserRepository.updateProfile(user, username, contract, tokenId, image);

            return res.status(200).json({
                'success': true,
                'message': 'Updated Profile',
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Update profile failed.');
        }
    };
}
