const PusherServer  = require('pusher');
//const PusherClient = require('pusher-js');


const pusher = new PusherServer({
/*   appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET, */
  appId: "1733202",
  key: "f449e4a0099f05988090",
  secret: "aea35c0840f440790a05",
  cluster: 'eu',
  useTLS: true
});

/* const pusherClient = new PusherClient({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: 'eu',
  useTLS: true
  cluster: 'eu',
  authEndpoint: '/api/pusher-auth',
  authTransport: 'ajax',
  auth: {
    headers: {
      'Content-Type': 'application/json',
    },
  } 
});
 */
module.exports = { pusher };