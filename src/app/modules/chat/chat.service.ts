import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import Chat from './chat.models';
import { IChat } from './chat.interface';
import Message from '../messages/messages.models';
import { deleteFromS3 } from '../../utils/s3';
import { User } from '../user/user.models';
import { startSession, Types } from 'mongoose';

// Create chat
const createChat = async (payload: IChat) => {
  const user1 = await User.findById(payload?.participants[0]);

  if (!user1) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid user');
  }

  const user2 = await User.findById(payload?.participants[1]);

  if (!user2) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid user');
  }

  const alreadyExists = await Chat.findOne({
    participants: { $all: payload.participants },
  }).populate(['participants']);

  if (alreadyExists) {
    return alreadyExists;
  }

  const result = Chat.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat creation failed');
  }
  return result;
};

// Get my chat list
const getMyChatList = async (userId: string) => {
  const chats = await Chat.find({
    participants: { $in: [new Types.ObjectId(userId)] },
  }).populate({
    path: 'participants',
    select: 'name email profile role _id phoneNumber',
    match: { _id: { $ne: new Types.ObjectId(userId) } },
  });

  if (!chats) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat list not found');
  }

  const data = [];
  for (const chatItem of chats) {
    const chatId = chatItem?._id;

    // Find the latest message in the chat
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message: any = await Message.findOne({
      //@ts-ignore
      chat: chatId.toString,
    }).sort({
      updatedAt: -1,
    });

    const unreadMessageCount = await Message.countDocuments({
      //@ts-ignore
      chat: chatId,
      seen: false,
      sender: { $ne: new Types.ObjectId(userId) },
    });

    if (message) {
      data.push({ chat: chatItem, message: message, unreadMessageCount });
    }
  }
  data.sort((a, b) => {
    const dateA = (a.message && a.message.createdAt) || 0;
    const dateB = (b.message && b.message.createdAt) || 0;
    return dateB - dateA;
  });

  return data;
};

// Get chat by ID
const getChatById = async (id: string) => {
  const result = await Chat.findById(id).populate({
    path: 'participants',
    select: 'name email image role _id phoneNumber ',
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
  }
  return result;
};
const getChatByUserId = async (currentUser: string, secondUser: string) => {
  const result = await Chat.findOne({
    participants: {
      $all: [new Types.ObjectId(currentUser), new Types.ObjectId(secondUser)],
    },
  }).populate({
    path: 'participants',
    select: 'name email image role _id phoneNumber ',
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
  }
  return result;
};

// Update chat list
const blockedChat = async (id: string, blockBy: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid chat id');
  }

  if (!Types.ObjectId.isValid(blockBy)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
  }

  const updatedChat = await Chat.findOneAndUpdate(
    { _id: new Types.ObjectId(id) },
    [
      {
        $set: {
          status: {
            $cond: [{ $eq: ['$status', 'blocked'] }, 'accepted', 'blocked'],
          },
          blockBy: {
            $cond: [
              { $eq: ['$status', 'blocked'] },
              null,
              new Types.ObjectId(blockBy),
            ],
          },
        },
      },
    ],
    {
      new: true,
      lean: true,
    },
  );

  if (!updatedChat) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat not found');
  }

  return updatedChat;
};

const updateChatList = async (id: string, payload: Partial<IChat>) => {
  const result = await Chat.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
  }
  return result;
};

// Delete chat list
const deleteChatList = async (id: string) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // 1. delete messages
    //@ts-ignore
    await Message.deleteMany({ chat: id }, { session });

    // 2. delete chat
    const result = await Chat.findByIdAndDelete(new Types.ObjectId(id), {
      session,
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
    }

    // ✅ commit DB changes first
    await session.commitTransaction();
    session.endSession();

    // 3. delete S3 AFTER commit (important)
    await deleteFromS3(`images/messages/${id}`);

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const chatService = {
  createChat,
  getMyChatList,
  getChatById,
  updateChatList,
  deleteChatList,
  getChatByUserId,
  blockedChat,
};
