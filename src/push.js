// Push notifications disabled - no VAPID keys configured
module.exports = {
  sendNotification: () => {
    console.log('Push notifications disabled');
    return Promise.resolve();
  }
};