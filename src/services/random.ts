import 'dotenv/config';
import { betContract, rpcProvider } from '../utils';
import { ethers } from 'ethers';

async function main() {
    const signer =  new ethers.Wallet(process.env.PRIVATE_KEY as string, rpcProvider);
    const tx = await betContract.connect(signer).stakeNftA([10]);
    console.log(tx);
    await tx.wait();
    console.log('Staked');
    process.exit(1);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
