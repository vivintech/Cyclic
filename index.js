require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const Questions = require('./models/questions');

const app = express()
const PORT = process.env.PORT || 3000

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {dbName: 'quiz'});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

//Routes go here
app.get('/', (req,res) => {
    res.send({ title: 'Questions' });
})

app.get('/questions', async (req,res)=> {

  const questions = await Questions.find();

  if (questions) {
    res.json(questions)
  } else {
    res.send("Something went wrong.");
  }
  
});

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})