import cron from 'node-cron';
import { pubClient } from '../redis';
import Message from '../modules/messages/messages.models';
import { tryCatch } from 'bullmq';

cron.schedule('*/10 * * * * *', async () => {
  const keys = await pubClient.keys('chat:*:messages');

  for (const key of keys) {
    const parsedMessages = [];

    while (true) {
      const msg = await pubClient.lPop(key);

      if (!msg) break;

      parsedMessages.push(JSON.parse(msg));
    }

    if (!parsedMessages.length) continue;

    try {
      await Message.insertMany(parsedMessages);

      console.log('✅ Saved:', parsedMessages.length);
    } catch (err) {
      console.error('Error saving messages:', err);
    }
  }
});
