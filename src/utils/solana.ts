import * as solanaWeb3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import * as idl from '../abis/solana/idl.json';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
// TODO: should be removed when launching
import * as TestIDL from '../abis/solana/testidl.json';

const { Connection, PublicKey, Keypair } = solanaWeb3;
const { Program, web3, utils, AnchorProvider, BN, Wallet } = anchor;
const ESCROW_VAULT_SEED = 'alphabets-escrow-vault-new';
const BET_INFO_SEED = 'alphabets-account-new';

const ADMIN_KEY = process.env.SOLANA_ADMIN_KEY || '';
const keypair = Keypair.fromSecretKey(bs58.decode(ADMIN_KEY));
const wallet = new Wallet(keypair);
const programID = new PublicKey(idl.metadata.address);
// const abpMintPubkey = new PublicKey('BonB8rnokgtdSe2HRuQZ4ZiZCbtos9sKdYwabgvNcPSp');
const strTou8Arry = (s: string) => {
    const enc = new TextEncoder();
    return enc.encode(s);
};

const network = 'https://api.devnet.solana.com'; // https://api.devnet.solana.com
const connection = new Connection(network, 'confirmed');

const getProvider = () => {
    /* create the provider and return it to the caller */
    /* network set to local network for now */

    const network = 'https://metaplex.devnet.rpcpool.com'; // https://api.devnet.solana.com
    const connection = new Connection(network, 'processed');

    return new AnchorProvider(
        connection, wallet, {
            preflightCommitment: 'processed'
        },
    );
};

const getSolanaProvider = () => {
    const network = 'https://api.devnet.solana.com';
    const connection = new Connection(network, 'processed');

    return new AnchorProvider(
        connection, wallet, {
            preflightCommitment: 'processed'
        },
    );
};

export async function getBattlePDA() {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    return await PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED))],
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

export async function getBettingPDA(battleId: string) {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    return await PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
        Buffer.from(strTou8Arry(battleId).buffer)],
        program.programId
    );
}

export async function startBet(battleId: string, startTime: number, endTime: number, collectionA?: string, collectionB?: string, fee?: number, abp_amount?: number) {
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);
    const pfee = fee ? fee : 50;
    const pabp_amount = abp_amount ? new BN(abp_amount).mul(new BN(1e9)) : new BN(3e12);
    const pColA = collectionA ? new PublicKey(collectionA) : provider.wallet.publicKey;
    const pColB = collectionB ? new PublicKey(collectionB) : provider.wallet.publicKey;
    const [battlePubKey, battleBump] = await getBattlePDA();
    const [bettingPubKey, bettingBump] = await getBettingPDA(battleId);
    try {
        await program.rpc.startBet(
            battleBump,
            bettingBump,
            battleId,
            startTime,
            endTime,
            pfee,
            pabp_amount,
            pColA,
            pColB,
            {
                accounts: {
                    battleAccount: battlePubKey,
                    bettingAccount: bettingPubKey,
                    admin: provider.wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                    rent: web3.SYSVAR_RENT_PUBKEY,
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
    const [battlePubKey, battleBump] = await getBattlePDA();
    const [bettingPubKey, bettingBump] = await getBettingPDA(battleId);
    const [vaultPubKey, vaultBump] = await getVaultPDA();
    await program.rpc.determineBet(
        battleBump,
        bettingBump,
        vaultBump,
        battleId,
        {
            accounts: {
                battleAccount: battlePubKey,
                escrowAccount: vaultPubKey,
                bettingAccount: bettingPubKey,
                admin: provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
                rent: web3.SYSVAR_RENT_PUBKEY,
            }
        }
    );
};

export const getEndTime = async (battleId: string): Promise<number> => {
    const provider = getProvider();
    const program = new Program(idl as anchor.Idl, programID, provider);
    const [bettingPubKey] =
        await PublicKey.findProgramAddress(
            [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
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

export const getTimeStamp = async (): Promise<number> => {
    const connection = new Connection('https://metaplex.devnet.rpcpool.com', 'processed');
    const slot = await connection.getSlot();
    const timestamp = await connection.getBlockTime(slot);
    return timestamp || 0;
};

export const getProgram = () => {
    const provider = getProvider();
    return new Program(idl as any, programID, provider);
};

export const getTestProgram = () => {
    const provider = getSolanaProvider();
    const programID = new PublicKey(TestIDL.metadata.address);
    return new Program(TestIDL as any, programID, provider);
};

export const validateAddress = (address: string) => {
    try {
        new PublicKey(address);
        return true;
    } catch (e) {
        return false;
    }
};

export const getTransactions = async () => {
    try {
        const pubKey = new PublicKey(idl.metadata.address);
        const txList = await connection.getSignaturesForAddress(pubKey);

        const signatureList = txList.map(transaction => transaction.signature);
        const transactionDetails = await connection.getParsedTransactions(signatureList);

        txList.forEach((transaction, i) => {
            if (transaction && transactionDetails[i]) {
                const date = new Date((transaction.blockTime || 0) * 1000);
                const transactionInstructions = transactionDetails[i]?.transaction.message.instructions;
                console.log(`Transaction No: ${i + 1}`);
                console.log(`Signature: ${transaction.signature}`);
                console.log(`Time: ${date}`);
                // @ts-ignore
                console.log(`Status: ${transaction.confirmationStatus}`);
                transactionInstructions?.forEach((instruction, n) => {
                    // @ts-ignore
                    console.log(`---Program Instructions ${n + 1}: ${instruction?.program ? instruction?.program + ':' : ''} ${instruction.programId.toString()}`);
                });
                console.log(('-').repeat(20));
            }
        });
    } catch (e) {
        console.error(e);
    }
};
