import callbackFn from '../../utils/callbackFn';
import Message from '../../modules/messages/messages.models'; 
import Chat from '../../modules/chat/chat.models';
import { IChat } from '../../modules/chat/chat.interface';
import getChatList from './chatList.handlers';
import { invalidateUserCache } from './invalidCash'; 

const SeenMessageHandlers = async (
  io: any,
  chatId: string,
  user: any,
  callback: any,
) => {
  if (!chatId) {
    return callbackFn(callback, {
      success: false,
      message: 'chatId id is required',
    });
  }

  try {
    const chat: IChat | null = await Chat.findById(chatId);

    if (!chat) {
      return callbackFn(callback, {
        success: false,
        message: 'chat not found',
      });
    }
    await Message.updateMany(
      {
        //@ts-ignore
        chat: chatId,
        //@ts-ignore
        receiver: user?.userId,
        seen: false,
      },
      { $set: { seen: true } },
    );

    const user1 = chat?.participants[0];
    const user2 = chat?.participants[1];
    invalidateUserCache(user1?.toString());
    invalidateUserCache(user2?.toString());
    getChatList(
      io,
      { userId: user1?.toString() },
      { page: 1, limit: 10 },
      callback,
    );
    getChatList(
      io,
      { userId: user2?.toString() },
      { page: 1, limit: 10 },
      callback,
    );
  } catch (error: any) {
    console.log(error);
    return callbackFn(callback, {
      success: false,
      message: error?.message || 'seen message failed',
    });
  }
};

export default SeenMessageHandlers;
