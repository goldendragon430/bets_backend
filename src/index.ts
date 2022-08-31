import { Application, urlencoded, json } from 'express';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as multer from 'multer';
import * as cors from 'cors';

import rateLimiter from './middlewares/rateLimit';
import { unCoughtErrorHandler } from './handlers/errorHandler';
import Routes from './routes';
import { installNFTStakedEvents } from './services/events';
import redisHandle from './utils/redis';
import { setupCronJobMap } from './services/cronManager';

// app.enable('trust proxy') // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

export default class Server {
    constructor(app: Application) {
        this.config(app);
        this.connect();
        this.initRedis();
        installNFTStakedEvents();
        new Routes(app);
    }

    public connect(): void {
        mongoose.connect(process.env.DB_CONFIG as string)
            .then(() => {
                console.log('Connected to Database');
                setupCronJobMap()
                    .then(() => {
                        console.log('setupCronJobMap done');
                    });
            })
            .catch(err => {
                throw new Error(err);
            });
        mongoose.set('debug', true);
    }

    public config(app: Application): void {
        app.use(morgan('dev'));
        app.use(urlencoded({extended: true}));
        app.use(json());
        app.use(helmet());
        app.use(cors());
        app.use(rateLimiter()); //  apply to all requests
        app.use(unCoughtErrorHandler);
        app.use(multer({dest: './uploads/'}).any());
    }

    public initRedis(): void {
        redisHandle.init()
            .then(() => {
                console.log('Redis connected');
                redisHandle.onConnect();
                redisHandle.onError();
            });
    }
}

process.on('beforeExit', function (err) {
    console.error(err);
});
