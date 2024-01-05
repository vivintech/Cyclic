// src/index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const sirv = require('sirv');
const { createServer } = require('http');
const { resolve } = require('path');
//const { pusher } = require('./src/lib/pusher');
const Pusher = require("pusher");

const app = express();
const db = new PrismaClient();
const port = process.env.PORT || 3001;
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  useTLS: true, 
  cluster: "eu"
});

app.use(cors());
app.use(sirv(resolve(__dirname, 'public')));
app.use(express.json());

module.exports = { db };

// Initializing routes by requiring routes.js
require('./routes')(app, db, pusher);

 // Create an HTTP server and listen on the specified port
const server = createServer(app);


// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
