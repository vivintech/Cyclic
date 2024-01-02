const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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
  }
});

const Questions = new mongoose.model("questions", questionSchema);

module.exports = Questions;