import { Document, Schema, Types, model, models } from "mongoose";

export interface IAccount extends Document {
  _id: string;
  userId: string,
  type: string,
  provider: string,
  providerAccountId: string,
  refresh_token: string,
  access_token: string,
  expires_at: Date,
  token_type: string,
  scope: string,
  id_token: string,
  session_state: string,

  user: Types.ObjectId,
}

const AccountSchema = new Schema({
  userId: { type: String },
  type: { type: String },
  provider: { type: String, unique: true },
  providerAccountId: { type: String, unique: true },
  refresh_token: { type: String },
  access_token: { type: String },
  expires_at: { type: Number },
  token_type: { type: String },
  scope: { type: String },
  id_token: { type: String },
  session_state: { type: String },

  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Account = models.Account || model('Account', AccountSchema);

export default Account;