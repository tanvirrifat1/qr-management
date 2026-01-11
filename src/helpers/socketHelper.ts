import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';
import { Message } from '../app/modules/message/message.model';
import { Inbox } from '../app/modules/inbox/inbox.model';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const socket = (io: Server) => {
  io.on('connection', socket => {
    logger.info(colors.blue('A user connected'));

    // Join a chat inbox
    socket.on('join', inboxId => {
      socket.join(inboxId);
      console.log(`User joined inbox: ${inboxId}`);
    });
    //send message
    socket.on('send-message', async ({ inboxId, senderId, message }) => {
      try {
        const newMessage = await Message.create({
          inboxId,
          senderId,
          message,
        });

        if (newMessage) {
          await Inbox.updateOne({ _id: inboxId }, { $inc: { unreadCount: 1 } });
        }

        io.emit(`receive-message:${newMessage?.inboxId}`, newMessage);
      } catch (error) {
        logger.error(error);
      }
    });

    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
