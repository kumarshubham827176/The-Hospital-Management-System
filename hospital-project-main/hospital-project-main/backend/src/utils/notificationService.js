const sendNotification = async ({ user, type, message, channel = 'email' }) => {
  console.log(`[Notification][${channel}] ${type} -> ${user?.email || 'unknown'}: ${message}`);
  return true;
};

module.exports = { sendNotification };
