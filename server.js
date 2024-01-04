// src/index.js
const express = require('express');
//const pusher = require('pusher');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const sirv = require('sirv');
const { createServer } = require('http');
const { resolve } = require('path');

const app = express();
const db = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(sirv(resolve(__dirname, 'public')));

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

 // Create an HTTP server and listen on the specified port
const server = createServer(app);


// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
