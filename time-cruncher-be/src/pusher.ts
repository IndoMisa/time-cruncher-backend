import Pusher = require('pusher');

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: process.env.PUSHER_ENCRYPTED == 'true' ? true : false,
});