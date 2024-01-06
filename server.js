// src/index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const sirv = require('sirv');
const { createServer } = require('http');
const { resolve } = require('path');
//const { pusher } = require('./src/lib/pusher');
const mongoose = require("mongoose");
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

/* const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://vivien:KqOA2K3VuNArnDM@ddf.zj3ikzc.mongodb.net/", { dbName: 'ddf' });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // After connecting, call the updateBatchField function
    await updateBatchField();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
} */

// Connect to MongoDB and run the update script
/* async function updateBatchField() {
  try {
    // Fetch all questions
    const QuestionModel = mongoose.model('Questions', new mongoose.Schema({
      question: {
        type: String,
        required: true
      },
      solution: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      batch: {
        type: Number  // Ensure batch is defined as a number in the schema
      }
    }), 'Questions'); // Replace 'Question' with your actual Mongoose model name
    const questions = await QuestionModel.find({});

    let batchCounter = 0;

    // Create an array of update operations for each document
    const updateOperations = questions.map((question) => {
      // Increment batchCounter for each document
      const operation = {
        updateOne: {
          filter: { _id: question._id },
          update: { $set: { batch: batchCounter } }
        }
      };

      // Increment batchCounter for the next document
      batchCounter++;

      return operation;
    });

    // Use the updateMany method to update all documents in a single operation
    const result = await QuestionModel.bulkWrite(updateOperations);

    // Verify that documents were updated successfully
    if (result.modifiedCount === questions.length) {
      console.log('Batch field added to documents.');
    } else {
      console.log('Error updating batch field.');
    }
  } catch (error) {
    console.error('Error updating batch field:', error);
  }
}; */


// Endpoint to trigger the script
/* app.get('/update-batch-field', (req, res) => {
  connectDB().then(() => {
    res.send('Batch field updated successfully.');
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Internal Server Error');
  });
}); */

module.exports = { db };

// Initializing routes by requiring routes.js
require('./routes')(app, db, pusher);

// Create an HTTP server and listen on the specified port
const server = createServer(app);


// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
