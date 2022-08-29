import * as passport from 'passport';
import {
    Strategy as JWTStrategy,
    ExtractJwt,
    StrategyOptions,
} from 'passport-jwt';
import UserModel from '../models/users';
import { JWT_CONFIG } from '../config';

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: JWT_CONFIG.secret,
};

passport.use(
    'jwt',
    new JWTStrategy(opts, (jwt_payload: any, done: any) => {
        UserModel.findById(jwt_payload._id)
            .then((user) => {
                if (user) {
                    if (user.isAdmin === true) {
                        return done(null, user);
                    }
                    return done(null, false);
                }
                return done(null, false);
            }).catch(err => console.error(err));
    })
);

export default passport;
