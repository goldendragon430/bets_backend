import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import { Client } from 'twitter-api-sdk';
import axios from 'axios';

const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN || '';

export default class ThirdPartyController {
    twitterClient = new Client(TWITTER_ACCESS_TOKEN as string);

    constructor() {}

    /**
     * Get NFTs Function
     * @param req
     * @param res
     * @param next
     */
    getTwitterThread = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { keyword } = req.query;
        try {
            const tweet = await this.twitterClient.tweets.tweetsRecentSearch({
                query: `#${keyword}`,
                max_results: 100,
                'tweet.fields': ['attachments', 'author_id', 'created_at'],
                expansions: ['attachments.media_keys', 'author_id'],
                'media.fields': [
                    'alt_text',
                    'duration_ms',
                    'height',
                    'media_key',
                    'preview_image_url',
                    'public_metrics',
                    'type',
                    'url',
                    'variants',
                    'width'
                ],
                'user.fields': ['name', 'username', 'profile_image_url'],
            });

            return res.status(200).json({
                success: true,
                message: '',
                data: tweet,
            });
        } catch (error) {
            console.log(error);
            apiErrorHandler(error, req, res, 'Get Twitter Thread failed.');
        }
    };
    /**
     * Get MagicEden items
     * @param req
     * @param res
     * @param next
     */
    getMagicEdenItems = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { address, network } = req.params;
        try {
            const { data } = await axios.get(`https://api-${network === 'mainnet' ? 'mainnet' : 'devnet'}.magiceden.dev/v2/wallets/${address}/tokens?offset=0&limit=100&listStatus=both`);

            return res.status(200).json({
                success: true,
                message: '',
                data: data,
            });
        } catch (error) {
            console.log(error);
            apiErrorHandler(error, req, res, 'Get Magic Eden items failed.');
        }
    };
}
