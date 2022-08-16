import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';

import tokenTxs from '../repositories/tokenTx';

export default class TokenTxController {
  constructor() { }

  /**
   * @description Get Txs Function
   * @param req
   * @param res
   * @param next
   */
  getTokenTx = async (req: Request, res: Response, next: NextFunction) => {
    const { nftId } = req.body;

    try {
        const txs = await tokenTxs.getTokenTxs();

        res.json({'success': true, 'message': '', 'data': txs});
    } catch (error) {
        apiErrorHandler(error, req, res, 'Get Tx failed.');
    }
  }

  /**
   * @description Add Tx Function
   * @param req
   * @param res
   * @param next
   */
  addTx = async (req: Request, res: Response, next: NextFunction) => {
    const {
        nftID,
        transactionType,
        multiplier,
        tokenType,
        totalPoints,
        chainType,
        walletAddress,
        onChainVerification,
    } = req.body;

    try {
        // const tx = await tokenTxs.addTokenTx(
        //     nftID,
        //     transactionType,
        //     multiplier,
        //     tokenType,
        //     totalPoints,
        //     chainType,
        //     walletAddress,
        //     onChainVerification,
        // );

        res.json({'success': true, 'message': '', 'data': 'tx'});
    } catch (error) {
        apiErrorHandler(error, req, res, 'Add Tx failed.');
    }
  }
}
