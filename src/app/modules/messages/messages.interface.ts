import { Model, Schema, Types } from 'mongoose';

export interface IMessages {
  _id?: Types.ObjectId;
  id?: string;
  text?: string;
  imageUrl?: string[];
  seen: boolean;
  chat: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
}

export type IMessagesModel = Model<IMessages, Record<string, unknown>>;
