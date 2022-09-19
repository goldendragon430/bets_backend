import { AnchorProvider, BN, Program, utils, web3, Wallet } from '@project-serum/anchor';
import {
  Connection,
  sendAndConfirmRawTransaction,
  Transaction,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Keypair,
} from '@solana/web3.js'
import * as idl from '../abis/solana/idl.json';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

const network = 'devnet'

const opts = {
  preflightCommitment: 'processed',
};
const programID = new PublicKey(idl.metadata.address);

const ESCROW_VAULT_SEED = 'alphabets-escrow-vault-new';
const BET_INFO_SEED = 'alphabets-account-new';
const abpMintPubkey = new PublicKey('BonB8rnokgtdSe2HRuQZ4ZiZCbtos9sKdYwabgvNcPSp');
const ADMIN_KEY = process.env.SOLANA_ADMIN_KEY || '';
const keypair = Keypair.fromSecretKey(bs58.decode(ADMIN_KEY));
const wallet = new Wallet(keypair);

const strTou8Arry = (s: string) => {
  var enc = new TextEncoder();
  return enc.encode(s);
}

async function getProvider() {
    const network = 'https://metaplex.devnet.rpcpool.com'; // https://api.devnet.solana.com
    const connection = new Connection(network, 'processed');

    const provider = new AnchorProvider(
        connection, wallet, {
        preflightCommitment: 'processed'
    },
    );
    return provider;
}

export async function getBattlePDA() {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  return await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED))],
    program.programId
  );
}

export async function getVaultPDA() {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  return await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(ESCROW_VAULT_SEED))],
    program.programId
  );
}

export async function getABPVaultPDA() {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  return await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
      abpMintPubkey.toBuffer()],
    program.programId
  );
}

export async function getBettingPDA(battleId: string) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  return await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
      Buffer.from(strTou8Arry(battleId).buffer)],
    program.programId
  );
}

export async function getUserBettingPDA(battleId: string) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  return await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(BET_INFO_SEED)),
      Buffer.from(strTou8Arry(battleId).buffer),
        provider.wallet.publicKey.toBuffer()],
    program.programId
  );
}

export async function getUserBetInfo(battleId: string) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  if(!provider.wallet.publicKey) return [];
  const [userBettingPubkey] = await getUserBettingPDA(battleId);
  try{
    let userBetInfo = await program.account.userBetAccount.fetch(userBettingPubkey);
    return userBetInfo;
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
  const provider = await getProvider();
  const [vaultPubkey] = await getVaultPDA();
  return await provider.connection.getBalance(vaultPubkey);
}

export async function getBetInfo(battleId: string) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const [bettingPubkey] = await getBettingPDA(battleId);
  try{
    let betInfo = await program.account.bettingAccount.fetch(bettingPubkey);
    return betInfo;
  } catch (err) {
    return [];
  }
}

export async function _bet( battleId: string, bet_side: any, bet_amount: any) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const [vaultPubkey, vaultBump] = await getVaultPDA();
  const [bettingPubkey, bettingBump] = await getBettingPDA(battleId);
  const [userBettingPubkey, userBettingBump] = await getUserBettingPDA(battleId);
  const amount = new BN(bet_amount).mul(new BN(1e6));
  try {
    await program.rpc.userBet(
      bettingBump,
      vaultBump,
      userBettingBump,
      battleId,
      bet_side,
      amount,
      { 
        accounts: {
          userAccount: provider.wallet.publicKey,
          bettingAccount: bettingPubkey,
          escrowAccount: vaultPubkey,
          userBettingAccount: userBettingPubkey,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        }
      });
    } catch (e) {
    console.log(e);
  }
}

export async function _deposit(amount: number) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const depo_amount = new BN(amount).mul(new BN(1e6));
  const [vaultPubkey, vaultBump] = await getVaultPDA();
  const [battlePubkey, battleBump] = await getBattlePDA();
  await program.rpc.deposit(
    battleBump,
    vaultBump,
    depo_amount,
    {
      accounts: {
        admin: provider.wallet.publicKey,
        battleAccount: battlePubkey,
        escrowAccount: vaultPubkey,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      }
    }
  );
}

export async function _withdraw(amount: number) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const withdraw_amount = new BN(amount).mul(new BN(1e6));
  const [vaultPubkey, vaultBump] = await getVaultPDA();
  const [battlePubkey, battleBump] =  await getBattlePDA();
  await program.rpc.withdraw(
    battleBump,
    vaultBump,
    withdraw_amount,
    {
      accounts: {
        admin: provider.wallet.publicKey,
        battleAccount: battlePubkey,
        escrowAccount: vaultPubkey,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      }
    }
  );
}

export const startBet = async (battleId:string, startTime: number, endTime: number, collectionA?: string, collectionB?: string, fee?: number, abp_amount?: number) => {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const pfee = fee ? fee : 50;
  const pabp_amount = abp_amount ? new BN(abp_amount).mul(new BN(1e9)) : new BN(3e12);
  const pColA = collectionA ? new PublicKey(collectionA) : provider.wallet.publicKey;
  const pColB = collectionB? new PublicKey(collectionB) : provider.wallet.publicKey;
  const [battlePubkey, battleBump] = await getBattlePDA();
  const [bettingPubkey, bettingBump] = await getBettingPDA(battleId);
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
          battleAccount: battlePubkey,
          bettingAccount: bettingPubkey,
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
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const [battlePubkey, battleBump] = await getBattlePDA();
  const [bettingPubkey, bettingBump] = await getBettingPDA(battleId);
  const [vaultPubkey, vaultBump] = await getVaultPDA();
  try {
    await program.rpc.determineBet(
      battleBump,
      bettingBump,
      vaultBump,
      battleId,
      {
        accounts: {
          battleAccount: battlePubkey,
          escrowAccount: vaultPubkey,
          bettingAccount: bettingPubkey,
          admin: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
}

export async function _close_battle(battleId: string) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const [battlePubkey, battleBump] = await getBattlePDA();
  const [bettingPubkey, bettingBump] = await getBettingPDA(battleId);
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
    )
  } catch (e) {
    console.log(e)
  }
}

export async function _stake(battleId: string, remainingAccounts: any, teamId: any) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const [bettingPubkey, bettingBump] = await getBettingPDA(battleId);
  const [userBettingPubkey, userBettingBump] = await getUserBettingPDA(battleId);
  const transaction = new Transaction();
  transaction.add( program.instruction.stake(bettingBump, userBettingBump, battleId, teamId, {
    accounts: {
      nftFromAuthority: provider.wallet.publicKey,
      bettingAccount: bettingPubkey,
      userBettingAccount: userBettingPubkey,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    remainingAccounts,
  }));
  return transaction;
}

export async function _unStake(battleId:string, remainingAccounts: any, teamId: any) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const [bettingPubkey, bettingBump] = await getBettingPDA(battleId);
  const [userBettingPubkey, userBettingBump] = await getUserBettingPDA(battleId);
  const transaction = new Transaction();
  transaction.add( program.instruction.unstake(bettingBump, userBettingBump, battleId, teamId, {
    accounts: {
      nftToAuthority: provider.wallet.publicKey,
      bettingAccount: bettingPubkey,
      userBettingAccount: userBettingPubkey,
    },
    remainingAccounts,
  }));
  return transaction;
}

export const executeAllTransactions = async (
  connection: Connection,
  wallet: Wallet,
  transactions: Transaction[],
) => {
  if (transactions.length === 0) return []

  const recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash
  for (let tx of transactions) {
    tx.feePayer = wallet.publicKey
    tx.recentBlockhash = recentBlockhash
  }
  await wallet.signAllTransactions(transactions)

  const txIds = await Promise.all(
    transactions.map(async (tx, index) => {
      try {
        const txid = await sendAndConfirmRawTransaction(
          connection,
          tx.serialize(),
        )
        return txid
      } catch (e) {
        console.log(e);
        return null
      }
    })
  )
  return txIds
}
