import passport from 'passport';
import * as dotenv from 'dotenv';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../models/users';
import {
    Strategy as JWTStrategy,
    ExtractJwt,
    StrategyOptions,
} from 'passport-jwt';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "username",
//       passwordField: "password",
//       session: false,
//     },
//     (username: string, password: string, done: any) => {
//       if (username === "hoge" && password === "fuga") {
//         return done(null, username);
//       } else {
//         return done(null, false, {
//           message: "usernameまたはpasswordが違います",
//         });
//       }
//     }
//   )
// );

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

passport.use(
    new JWTStrategy(opts, (jwt_payload: any, done: any) => {
        UserModel.findById(jwt_payload._id)
            .then(user => {
                if (user) return done(null, user);
                return done(null, false);
            }).catch(err => console.error(err));
    })
);

export default passport;