import * as solanaWeb3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import * as idl from '../abis/solana/idl.json';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

const { Connection, PublicKey, Keypair, SystemProgram } = solanaWeb3;
const { Program, web3, utils, AnchorProvider, BN, Wallet } = anchor;
const ESCROW_VAULT_SEED = 'alphabets-escrow-vault-new';
const BET_INFO_SEED = 'alphabets-account-new';

const ADMIN_KEY = process.env.SOLANA_ADMIN_KEY || '';
const keypair = Keypair.fromSecretKey(bs58.decode(ADMIN_KEY));
const wallet = new Wallet(keypair);
const programID = new PublicKey(idl.metadata.address);
const abpMintPubkey = new PublicKey('BonB8rnokgtdSe2HRuQZ4ZiZCbtos9sKdYwabgvNcPSp');
const strTou8Arry = (s: string) => {
    const enc = new TextEncoder();
    return enc.encode(s);
};

const getProvider = async () => {
    /* create the provider and return it to the caller */
    /* network set to local network for now */

    const network = 'https://metaplex.devnet.rpcpool.com'; // https://api.devnet.solana.com
    const connection = new Connection(network, 'processed');

    const provider = new AnchorProvider(
        connection, wallet, {
            preflightCommitment: 'processed'
        },
    );
    return provider;
};

export const initBet = async () => {
    const provider = await getProvider();
    const program = new Program(idl as anchor.Idl, programID, provider);
    const [battlePubkey, battleBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED))],
            program.programId
        );
    const [abpVaultPubkey, abpVaultBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(anchor.utils.bytes.utf8.encode(BET_INFO_SEED)),
            abpMintPubkey.toBuffer()],
            program.programId
        );
    try {
        await program.rpc.initBet(
            battleBump,
            abpVaultBump,
            {
                accounts: {
                    battleAccount: battlePubkey,
                    abpMint: abpMintPubkey,
                    abpVault: abpVaultPubkey,
                    initializer: provider.wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                }
            }
        );
    } catch (err) {
        console.log('initBet tx error: ', err);
    }
};

export const startBet = async (startTime: number, endTime: number, projectL: string, projectR: string, battleId: string) => {
    const provider = await getProvider();
    const projectLPubKey = new PublicKey(projectL);
    const projectRPubKey = new PublicKey(projectR);
    const program = new Program(idl as anchor.Idl, programID, provider);
    const newFee = 50;
    const abp_amount = new BN(3e12);
    const [battlePubkey, battleBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED))],
            program.programId
        );
    const [bettingPubkey, bettingBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer)],
            program.programId
        );
    try {
        await program.rpc.startBet(
            battleBump,
            bettingBump,
            battleId,
            startTime,
            endTime,
            newFee,
            abp_amount,
            projectLPubKey,
            projectRPubKey,
            {
                accounts: {
                    battleAccount: battlePubkey,
                    bettingAccount: bettingPubkey,
                    admin: provider.wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                }
            }
        );
    } catch (err) {
        console.log('startTime tx error: ', err);
    }
};

export const closeBet = async (battleId) => {
    const provider = await getProvider();
    const program = new Program(idl as anchor.Idl, programID, provider);
    const [battlePubkey, battleBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED))],
            program.programId
        );
    const [bettingPubkey, bettingBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer)],
            program.programId
        );
    try {
        await program.rpc.closeBet(
            battleBump,
            bettingBump,
            battleId,
            {
                accounts: {
                    battleAccount: battlePubkey,
                    bettingAccount: bettingPubkey,
                    admin: provider.wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                }
            }
        );
    } catch (err) {
        console.log('closeBet tx error: ', err);
    }
};

export const unStakeAll = async (userAddr, battleId) => {
    const userPubkey = new PublicKey(userAddr);
    const provider = await getProvider();
    const program = new Program(idl as anchor.Idl, programID, provider);
    const [bettingPubkey, bettingBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer)],
            program.programId
        );
    const [userBettingPubkey, userBettingBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer),
            provider.wallet.publicKey.toBuffer()],
            program.programId
        );
    await program.rpc.unstakeAdmin(bettingBump, battleId, {
        accounts: {
            nftToAuthority: provider.wallet.publicKey,
            bettingAccount: bettingPubkey,
            userBettingAccount: userBettingPubkey,
        },
    });
};

export const determineBet = async (battleId: string) => {
    const provider = await getProvider();
    const program = new Program(idl as anchor.Idl, programID, provider);
    const [battlePubkey, battleBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED))],
            program.programId
        );
    const [bettingPubkey, bettingBump] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer)],
            program.programId
        );
    try {
        await program.rpc.determineBet(
            battleBump,
            bettingBump,
            battleId,
            {
                accounts: {
                    battleAccount: battlePubkey,
                    bettingAccount: bettingPubkey,
                    admin: provider.wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                }
            }
        );
    } catch (err) {
        console.log('determineBet tx error: ', err);
    }
};

export const getEndTime = async (battleId) => {
    const provider = await getProvider();
    const program = new Program(idl as anchor.Idl, programID, provider);
    const [bettingPubkey] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer)],
            program.programId
        );
    try {
        const bettingData = await program.account.bettingAccount.fetch(bettingPubkey);
        const endTime = bettingData.endTime;
        return endTime;
    } catch (err) {
        console.log('auto test: ', err);
        return 0;
    }
};

export const getTimeStamp = async () => {
    const connection = new Connection('https://metaplex.devnet.rpcpool.com', 'processed');
    const slot = await connection.getSlot();
    const timestamp = await connection.getBlockTime(slot);
    return timestamp;
};

export const getUserBetInfo = async (userAddr: string, battleId: string) => {
    const userPubkey = new PublicKey(userAddr);
    const provider = await getProvider();
    const program = new Program(idl as anchor.Idl, programID, provider);
    const [userBettingPubkey] =
        await web3.PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
            Buffer.from(strTou8Arry(battleId).buffer),
            provider.wallet.publicKey.toBuffer()],
            program.programId
        );
    try {
        const userBetInfo = await program.account.userBetAccount.fetch(userBettingPubkey);
        return userBetInfo;
    } catch (err) {
        return [];
    }
};
