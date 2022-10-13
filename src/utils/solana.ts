import * as solanaWeb3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { Idl } from '@project-serum/anchor';
import * as idl from '../abis/solana/idl.json';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { SolanaParser } from './solana-parser';
import { solanaBettedFunc, solanaClaimFunc, solanaStakedFunc } from '../services/getEventFunc';
import redisHandle from './redis';
import { RewardType } from './enums';
import { getSolanaAddress, getSolanaRPC } from '../config';

const { Connection, PublicKey, Keypair } = solanaWeb3;
const { Program, web3, utils, AnchorProvider, BN, Wallet } = anchor;

const contractAddress = getSolanaAddress();
const ADMIN_KEY = process.env.SOLANA_ADMIN_KEY || '';
const keypair = Keypair.fromSecretKey(bs58.decode(ADMIN_KEY));
const wallet = new Wallet(keypair);
const programID = new PublicKey(contractAddress || idl.metadata.address);
// const abpMintPubkey = new PublicKey('BonB8rnokgtdSe2HRuQZ4ZiZCbtos9sKdYwabgvNcPSp');
const strTou8Arry = (s: string) => {
    const enc = new TextEncoder();
    return enc.encode(s);
};
const RPC_URL = getSolanaRPC();
const parser = new SolanaParser([
    {
        idl: idl as Idl,
        programId: programID
    }
]);

const opts = {
    preflightCommitment: 'processed',
};
const ADMIN_MANAGE_SEED = 'alphabets-admin';
const ESCROW_VAULT_SEED = 'alphabets-escrow-vault';
const BATTLE_INFO_SEED = 'alphabets-battle-info';
const abpMintPubkey = new PublicKey('NxGcGqZ8FLpmDgJ35JK8xDivCo3EP3G5BbpBjE2cUQT');
const SUPER_ADMIN = new PublicKey('52UcVJFGTDXqy4mxQz9FWcN95qT653nBRCwFCevymrQz');

const network = RPC_URL;
const connection = new Connection(RPC_URL, 'confirmed');

const getProvider = () => {
    const connection = new Connection(network, 'processed');

    return new AnchorProvider(
        connection, wallet, {
            preflightCommitment: 'processed'
        },
    );
};

export const getSolanaProvider = () => {
    const connection = new Connection(network, 'processed');

    return new AnchorProvider(
        connection, wallet, {
            preflightCommitment: 'processed'
        },
    );
};

export async function getAdminPDA() {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    return await PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode(ADMIN_MANAGE_SEED)),
            SUPER_ADMIN.toBuffer()],
        program.programId
    );
}

export async function getVaultPDA() {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    return await PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode(ESCROW_VAULT_SEED))],
        program.programId
    );
}

export async function getABPVaultPDA() {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    return await PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode(BATTLE_INFO_SEED)),
            abpMintPubkey.toBuffer()],
        program.programId
    );
}

export async function getBattlePDA(battleId: string) {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    return await PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode(BATTLE_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer)],
        program.programId
    );
}

export async function getUserBattlePDA(battleId: string) {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    return await web3.PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode(BATTLE_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer),
            provider.wallet.publicKey.toBuffer()],
        program.programId
    );
}

export async function getUserBetInfo(battleId: string) {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    if (!provider.wallet.publicKey) return [];
    const [userBettingPubkey] = await getUserBattlePDA(battleId);
    try {
        return await program.account.userBattleAccount.fetch(userBettingPubkey);
    } catch (err) {
        return [];
    }
}

export async function getBalance() {
    const connection = new Connection(network, opts.preflightCommitment as any);
    const wallet = (window as any).solana;
    return await connection.getBalance(wallet.publicKey);
}

export async function getVaultBalance() {
    const provider = getProvider();
    const [vaultPubkey] = await getVaultPDA();
    return await provider.connection.getBalance(vaultPubkey);
}

export async function getBetInfo(battleId: string) {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    const [battlePubkey] = await getBattlePDA(battleId);
    try {
        return await program.account.battleAccount.fetch(battlePubkey);
    } catch (err) {
        return [];
    }
}

export async function startBet(battleId: string, startTime: number, endTime: number, collectionA?: string, collectionB?: string, fee?: number, abp_amount?: number) {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    const pfee = fee ? fee : 50;
    const pabp_amount = abp_amount ? new BN(abp_amount).mul(new BN(1e9)) : new BN(3e12);
    const pColA = collectionA ? new PublicKey(collectionA) : provider.wallet.publicKey;
    const pColB = collectionB ? new PublicKey(collectionB) : provider.wallet.publicKey;
    const [battlePubkey] = await getBattlePDA(battleId);
    const [adminPubkey] = await getAdminPDA();
    try {
        await program.rpc.startBattle(
            battleId,
            startTime,
            endTime,
            pfee,
            pabp_amount,
            pColA,
            pColB,
            {
                accounts: {
                    adminAccount: adminPubkey,
                    battleAccount: battlePubkey,
                    admin: provider.wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                }
            }
        );
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const determineBet = async (battleId: string) => {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    const [battlePubkey] = await getBattlePDA(battleId);
    const [vaultPubkey] = await getVaultPDA();
    const [adminPubkey] = await getAdminPDA();
    await program.rpc.determineBattle(
        battleId,
        {
            accounts: {
                adminAccount: adminPubkey,
                escrowAccount: vaultPubkey,
                battleAccount: battlePubkey,
                superAdmin: SUPER_ADMIN,
                admin: provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            }
        }
    );
};

export const getEndTime = async (battleId: string): Promise<number> => {
    const provider = getProvider();
    const program = new Program(idl as anchor.Idl, programID, provider);
    const [bettingPubKey] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BATTLE_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer)],
            program.programId
        );
    try {
        const bettingData = await program.account.battleAccount.fetch(bettingPubKey);
        return bettingData.endTime;
    } catch (err) {
        console.log('auto test: ', err);
        return 0;
    }
};

export const getProgram = () => {
    const provider = getProvider();
    return new Program(idl as any, programID, provider);
};

export const validateAddress = (address: string) => {
    try {
        new PublicKey(address);
        return true;
    } catch (e) {
        return false;
    }
};

const getProviderWithAnchor = () => {
    const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
    return new anchor.Program(idl as any, programID, provider);
};

const getTransactions = async (limitNum: number) => {
    try {
        const anchorProgram = getProviderWithAnchor();
        const redisClient = redisHandle.getRedisClient();
        const lastSignature = await redisClient.get('lastSignature') || undefined;
        const pubKey = new PublicKey(contractAddress || idl.metadata.address);
        let txList = await connection.getSignaturesForAddress(pubKey, { limit: limitNum, until: lastSignature });

        for (const transaction of txList) {
            const signature = transaction.signature;
            const parsedTx = await getParsedTransaction(signature);
            if (parsedTx) {
                if (parsedTx.name === 'userBet') {
                    await solanaBettedFunc(parsedTx.args.battleId, parsedTx.accounts[0].pubkey.toString(), parsedTx.args.betAmount, parsedTx.args.betSide, transaction.signature, transaction.slot);
                } else if (parsedTx.name === 'stake') {
                    const stakeEntryPubkey = parsedTx.accounts[0].pubkey;
                    const stakeEntry = await anchorProgram.account.stakeEntry.fetchNullable(stakeEntryPubkey);
                    await solanaStakedFunc(parsedTx.args.battleId, parsedTx.args.side, parsedTx.accounts[2].pubkey.toString(), stakeEntry?.originalMint.toString(), parsedTx.args.amount, transaction.signature, transaction.slot);
                } else if (parsedTx.name === 'claimReward') {
                    const txMeta = await connection.getParsedTransaction(transaction.signature);
                    const userPubkey = parsedTx.accounts[1].pubkey;
                    if (txMeta) {
                        const balanceIndex = txMeta.transaction.message.accountKeys.findIndex((account) => account.pubkey.toString() === userPubkey.toString());
                        let changeSOLBalance = 0;
                        let changeTokenBalance = 0;
                        if (txMeta.meta?.postBalances?.[balanceIndex] && txMeta.meta?.preBalances?.[balanceIndex]) {
                            changeSOLBalance = (txMeta.meta?.postBalances?.[balanceIndex] || 0) - (txMeta.meta?.preBalances?.[balanceIndex] || 0);
                        }
                        if (txMeta.meta?.postTokenBalances?.length === 2) {
                            changeTokenBalance = (txMeta.meta?.postTokenBalances?.[1]?.uiTokenAmount?.uiAmount || 0) - (txMeta.meta?.preTokenBalances?.[1]?.uiTokenAmount?.uiAmount || 0);
                        }
                        if (changeTokenBalance > 0) {
                            await solanaClaimFunc(parsedTx.args.battleId, userPubkey, new BN(changeTokenBalance).mul(new BN(1e9)), RewardType.ABP, transaction.signature, transaction.slot);
                        }
                        if (changeSOLBalance) {
                            await solanaClaimFunc(parsedTx.args.battleId, userPubkey, new BN(changeSOLBalance), RewardType.ETH, transaction.signature, transaction.slot);
                        }
                    }
                }
            }
        }
        txList = txList.sort((a, b) => {
            if (a && b && a.blockTime && b.blockTime) {
                return b.blockTime - a.blockTime;
            }
            return 0;
        });
        if (txList.length > 0) {
            await redisClient.set('lastSignature', txList[0].signature);
        }
    } catch (e) {
        console.error('getTransactions', e);
    }
};

export const getParsedTransaction = async (signature: string): Promise<any> => {
    try {
        const connection = new Connection(network, 'finalized');
        const parsedTransactions = await parser.parseTransaction(connection, signature, false);
        if (parsedTransactions) {
            return parsedTransactions[0];
        }
        return undefined;
    } catch (e) {
        console.error(e);
        return undefined;
    }
};

export const subscribeSolanaTransactions = async () => {
    async function sleep(number: number) {
        return new Promise( resolve => setTimeout(resolve, number) );
    }

    while (true) {
        await getTransactions(50);
        await sleep(10000);
    }
};
