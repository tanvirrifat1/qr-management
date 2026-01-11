// export const generateOrderId = (): string => {
//   const timestamp = Date.now().toString().slice(-8); // last 8 digits of time
//   const random = Math.floor(1000 + Math.random() * 9000).toString(); // 4 random digits
//   return timestamp + random; // ✅ 12 digits
// };

export const generateOrderId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let orderId = '';

  for (let i = 0; i < 12; i++) {
    orderId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return orderId;
};
