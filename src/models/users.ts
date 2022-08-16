import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: String,
    wallets: [{
        type: Schema.Types.ObjectId,
        ref: 'playerWallet'
    }]
},
{ timestamps: true });

export default mongoose.model('users', usersSchema);