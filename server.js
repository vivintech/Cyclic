// src/index.js
const express = require('express');
//const pusher = require('pusher');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const db = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());

/* // Pusher configuration
const pusherConfig = {
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: 'eu',
  useTLS: true,
};

const pusherServer = new pusher(pusherConfig);
//Export db variable
module.exports = { db, pusherConfig }; */

// Initializing routes by requiring routes.js
 require('./routes')(app, db);


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
