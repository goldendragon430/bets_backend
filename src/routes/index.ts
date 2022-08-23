import { Application } from 'express';
import tokenTxRouter from './tokenTxRouter';
import usersRouter from './usersRouter';
import stakedNFTRouter from './stakedNFTRouter';
import thirdPartyRouter from './thirdPartyRouter';
import featuredBattleRouter from './featuredBattleRouter';
import projectRouter from './projectRouter';
const express = require('express');

export default class Routes {
  constructor(app: Application) {
    // tokenTxs routes
    app.use('/api/v1/battles', featuredBattleRouter);
    // Third party routes
    app.use('/api/v1', thirdPartyRouter);
    // project routes
    app.use('/api/v1/projects', projectRouter);
    // // tokenTxs routes
    // app.use('/api/v1/tokentxs', tokenTxRouter);
    // // users routes
    // app.use('/api/v1/users', usersRouter);
    // // nftStaked routes
    // app.use('/api/v1/staked_nfts', stakedNFTRouter);
    // uploads
    app.use('/uploads', express.static(__dirname + '/../../uploads'));
  }
}
