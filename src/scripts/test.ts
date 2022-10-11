import * as dotenv from 'dotenv';
dotenv.config();
import * as solanaWeb3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
// TODO: should be removed when launching
import * as TestIDL from '../abis/solana/testidl.json';

const {Connection, PublicKey, Keypair, SystemProgram} = solanaWeb3;
const {Program, web3, utils, AnchorProvider, BN, Wallet} = anchor;

const ADMIN_KEY = process.env.SOLANA_ADMIN_KEY || '';
const keypair = Keypair.fromSecretKey(bs58.decode(ADMIN_KEY));
const wallet = new Wallet(keypair);

const programID = new PublicKey(TestIDL.metadata.address);
const network = 'https://api.devnet.solana.com'; // https://api.devnet.solana.com
const connection = new Connection(network, 'processed');

const provider = new AnchorProvider(
    connection, wallet, {
        preflightCommitment: 'processed'
    },
);

const program = new Program(TestIDL as any, programID, provider);
// program.addEventListener('MyEvent', (event, slot) => {
//     console.log(event, slot);
// });
// program.addEventListener('MyOtherEvent', (event, slot) => {
//     console.log(event, slot);
// });
try {
    program.rpc.initialize({})
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
} catch (e) {
    console.log(e);
}
