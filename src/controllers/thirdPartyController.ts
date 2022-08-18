import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import { Client } from 'twitter-api-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

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
        const { tweet_id } = req.query;
        try {
            const tweet = await this.twitterClient.tweets.tweetsRecentSearch({
                query: `conversation_id:${tweet_id}`,
                max_results: 100,
                'tweet.fields': ['author_id', 'created_at'],
                expansions: ['author_id'],
                'user.fields': ['name', 'username', 'profile_image_url'],
            });

            return res.status(200).json({
                success: true,
                message: '',
                data: tweet,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Twitter Thread failed.');
        }
    };
}
