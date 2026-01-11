import { Notification } from '../app/modules/notification/notification.model';

export const sendNotifications = async (data: any) => {
  const result = await Notification.create(data);

  //@ts-ignore
  const socketIo = global.io;

  if (data?.type === 'ADMIN' || data?.type === 'SUPER_ADMIN') {
    socketIo.emit(`get-notification::${data?.type}`, result);
  } else {
    socketIo.emit(`get-notification::${data?.receiver}`, result);
  }

  return result;
};

// import { Notification } from '../app/modules/notification/notification.model';

// export const sendNotifications = async (data: any) => {
//   const result = await Notification.create(data);

//   const socketIo = (global as any).io;
//   if (!socketIo) return result;

//   const { type, receiver } = data;

//   if (type === 'ADMIN' || type === 'SUPER_ADMIN') {
//     // Emit to type channel
//     socketIo.emit(`get-notification::${type}`, result);
//     // Emit to specific receiver
//     if (receiver) socketIo.emit(`get-notification::${receiver}`, result);
//   }

//   return result;
// };
