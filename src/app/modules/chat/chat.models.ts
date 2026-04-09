import { Schema, Types, model } from 'mongoose';
import { IChat, IChatModel } from './chat.interface';

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['accepted', 'blocked'],
      default: 'accepted',
    },
    blockedBy: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
);

const Chat = model<IChat, IChatModel>('Chat', chatSchema);
export default Chat;
