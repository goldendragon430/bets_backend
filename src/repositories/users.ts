import UserModel from '../models/users';
import playerWallet from '../models/playerWallet';

class UsersRepository {
  constructor() {}

  getUser = async (address: string) => {
    const filters = [{ address }];

    const user = await UserModel.findOne({ $and: filters });

    if ( user ) {
      return user;
    } else {
      return undefined;
    }
  }

  createUser = async (address: string) => {
    const nonce = Math.floor(Math.random() * 1000000);
    const user = new UserModel({
      username: address,
      address: address,
      nonce: nonce,
    });

    const savedUser = await user.save();

    return savedUser;
  }

  updateUser = async (user: any) => {
    const savedUser = await user.save();

    return savedUser;
  }

  addUser = async (username: string) => {
    const user = await UserModel.create({ username });

    if ( user ) {
      return user;
    } else {
      return undefined;
    }
  }

  addWallet = async (
    id: string,
    network: string,
    address: string,
  ) => {
    const filters = [{ id }];
    const user = await UserModel.findOne({ $and: filters });

    if ( user ) {
      const wallet = await playerWallet.findOne({ $and: [{ address }, { network }] });
      if (wallet) {
        await playerWallet.updateOne(
            { _id: wallet._id },
            { $set: { network: network, walletAddress: `${network}_${address}` } },
        );
      } else {
        const newWallet: any = await playerWallet.create({
          network: network,
          walletAddress: `${network}_${address}`,
          pointsUnclaimed: 0,
          medals: 0,
        });
        user.wallets.push(newWallet);
        await user.save();
      }
      return user;
    } else {
      return await playerWallet.create({
        network: network,
        walletAddress: `${network}_${address}`,
        pointsUnclaimed: 0,
        medals: 0,
      });
    }
  }
}

export default new UsersRepository();
