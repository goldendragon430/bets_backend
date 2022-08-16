import tokenTx from '../models/tokenTx';

class TokenTxRepository {
    constructor() {}

    getTokenTxs = async () => {
        return tokenTx.find();
    }

    addTokenTx = async(
        battle: any,
        project: any,
        transactionType: string,
        multiplier: number,
        tokenType: string,
        totalPoints: number,
        chainType: boolean,
        claimableTime: number,
        walletAddress: string,
        onChainVerification: string,
    ) => {
        const tx = new tokenTx({
            battle,
            project,
            transactionType,
            multiplier,
            tokenType,
            totalPoints,
            chainType,
            claimableTime,
            walletAddress,
            onChainVerification,
        });

        return tx.save();
    }
}

export default new TokenTxRepository();
