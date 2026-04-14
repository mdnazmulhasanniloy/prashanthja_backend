import { Server } from 'socket.io';
import { IUser } from '../../modules/user/user.interface';
import callbackFn from '../../utils/callbackFn';
import { User } from '../../modules/user/user.models';
import { pubClient } from '../../redis';
import Message from '../../modules/messages/messages.models';

const MessagePageHandlers = async (
  io: Server,
  payload: { userId: string; limit: number; page: number },
  currentUserId: string,
  callback: (data: any) => void,
) => {
  const { userId, page = 1, limit = 10 } = payload;
  if (!userId) {
    return callbackFn(callback, {
      success: false,
      message: 'userId is required',
    });
  }
  const skip = (page - 1) * limit;
  try {
    // 1️⃣ Check Redis cache for receiver details
    const receiverCacheKey = `user_details:${userId}`;
    let receiverDetails: IUser | null;

    const cachedReceiver = await pubClient.get(receiverCacheKey);
    if (cachedReceiver) {
      receiverDetails = JSON.parse(cachedReceiver);
    } else {
      receiverDetails = await User.findById(userId).select(
        '_id email role profile name',
      );
      if (!receiverDetails) {
        return callbackFn(callback, {
          success: false,
          message: 'User not found!',
        });
      }
      await pubClient.setEx(
        receiverCacheKey,
        60,
        JSON.stringify(receiverDetails),
      );
    }
    console.log(receiverDetails);
    if (!receiverDetails) {
      return;
    }

    const payload = {
      _id: receiverDetails._id,
      name: receiverDetails.name,
      email: receiverDetails.email,
      profile: receiverDetails.profile,
      role: receiverDetails.role,
    };

    // 2️⃣ Get sender’s socket ID from Redis
    const userSocket = await pubClient.hGet(
      'userId_to_socketId',
      currentUserId,
    );

    if (!userSocket) {
      return callbackFn(callback, {
        success: false,
        message: 'User socket ID not found',
      });
    }

    // 3️⃣ Emit receiver details to socket
    io.to(userSocket).emit('user_details', payload);

    // 4️⃣ Redis caching for messages
    const messageCacheKey = `messages:${currentUserId}:${userId}:${page}:${limit}`;
    let getPreMessage;

    const cachedMessages = await pubClient.get(messageCacheKey);
    if (cachedMessages) {
      getPreMessage = JSON.parse(cachedMessages);
    } else {
      getPreMessage = await Message.find({
        $or: [
          { sender: currentUserId, receiver: userId },
          { sender: userId, receiver: currentUserId },
        ],
      } as any)
        .sort({ updatedAt: 1 })
        .skip(skip)
        .limit(limit);

      await pubClient.setEx(messageCacheKey, 30, JSON.stringify(getPreMessage));
    }

    // 4️⃣ Total Message Count
    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    } as any);
    const messages = getPreMessage.reverse();

    const response = {
      data: messages,
      meta: {
        page,
        limit,
        total: totalMessages,
        totalPage: Math.ceil(totalMessages / limit),
        hasMore: skip + getPreMessage.length < totalMessages,
      },
    };

    // 5️⃣ Emit previous messages
    io.to(userSocket).emit('message', response || []);

    // 6️⃣ Final callback
    callbackFn(callback, {
      success: true,
      message: 'Message page data retrieved successfully',
      data: {
        ...response,
        userDetails: payload,
      },
    });
  } catch (error: any) {
    console.error('Error in message-page event:', error);
    callbackFn(callback, {
      success: false,
      message: error.message,
    });
  }
};

export default MessagePageHandlers;
