import { Application, urlencoded, json } from 'express';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as multer from 'multer';
import * as cors from 'cors';

import rateLimiter from './middlewares/rateLimit';
import Routes from './routes';
import redisHandle from './utils/redis';
import { getDBConfig } from './config';
import { unCoughtErrorHandler } from './handlers/errorHandler';
import { installBetEvents } from './services/events';
import { installSolanaEvents } from './services/solanaEvents';
import { setupCronJobMap } from './services/cronManager';
import { setupSolanaCronJobMap } from './services/solanaCronManager';

// app.enable('trust proxy') // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

export default class Server {
    DB_CONFIG: string;

    constructor(app: Application) {
        this.DB_CONFIG = getDBConfig();
        this.config(app);
        this.connect();
        this.initRedis();
        installBetEvents();
        installSolanaEvents();
        new Routes(app);
    }

    public connect(): void {
        mongoose.connect(this.DB_CONFIG)
            .then(() => {
                console.log('Connected to Database');
                const LOCAL_ENV = process.env.LOCAL;
                if (LOCAL_ENV) return;
                setupCronJobMap()
                    .then(() => {
                        console.log('setupCronJobMap done');
                    });
                setupSolanaCronJobMap()
                    .then(() => {
                        console.log('setupSolanaCronJobMap done');
                    });
            })
            .catch(err => {
                throw new Error(err);
            });
        mongoose.set('debug', true);
    }

    public config(app: Application): void {
        app.use(morgan('dev'));
        app.use(urlencoded({ extended: true }));
        app.use(json());
        app.use(helmet());
        app.use(cors());
        app.use(rateLimiter()); //  apply to all requests
        app.use(unCoughtErrorHandler);
        app.use(multer({ dest: './uploads/' }).any());
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
