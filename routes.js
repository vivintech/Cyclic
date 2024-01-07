// src/routes.js
let currentBatch = 0;

module.exports = (app, db, pusher) => {
  // GET
  app.get('/rooms/:roomId', async (req, res) => {
    try {
      const room = await db.chatRoom.findUnique({
        where: { id: req.params.roomId },
      });

      if (room) {
        res.json(room);
      } else {
        res.status(404).json({ error: "Room not found" });
      }
    } catch (error) {
      console.error("Error fetching room details from db:", error);
      res.status(500).json({ error: "Error fetching room details from db" });
    }
  });

  app.get('/rooms/:roomId/questions', async (req, res) => {
   /*  try {
      const roomId = req.params.roomId;
      const { batch = 1 } = req.query;
      const batchSize = 50;
  
      const question = await db.questions.findMany({
        where: { batch: parseInt(batch) },
        take: batchSize
      });
      pusher.trigger(roomId, 'incoming-question', { question: question, batch: batch});
      res.json(question);
    } catch (error) {
      console.error("Error fetching questions from db:", error);
      res.status(500).json({ error: "Error fetching questions from db" });
    } */
  });

// Fetch and broadcast the initial question when a user joins a room
app.post('/rooms/:roomId/question/current', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { roomCreated } = req.body;
    if(roomCreated) {
       currentBatch = Math.floor(Math.random() * 520);
    } 
    const batchSize = 1; // Set the initial batch size to 1

    const currentQuestion = await db.questions.findMany({
      where: { batch: currentBatch }, 
      take: batchSize
    });

    pusher.trigger(roomId, 'incoming-question', { question: currentQuestion, batch: currentBatch });
    // res.json(currentQuestion);
  } catch (error) {
    console.error("Error fetching initial question from db:", error);
    res.status(500).json({ error: "Error fetching initial question from db" });
  }
});

// Fetch and broadcast a new question when a user clicks on the "Next Question" button
app.get('/rooms/:roomId/question/next', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const randomBatch = Math.floor(Math.random() * 520);
    currentBatch = randomBatch;
    const batchSize = 1;

    const nextQuestion = await db.questions.findMany({
      where: { batch: parseInt(currentBatch) }, 
      take: batchSize
    });

    pusher.trigger(roomId, 'incoming-question', { question: nextQuestion, batch: currentBatch });
    //res.json(nextQuestion);
  } catch (error) {
    console.error("Error fetching next question from db:", error);
    res.status(500).json({ error: "Error fetching next question from db" });
  }
});

  app.get('/rooms/:roomId/messages', async (req, res) => {
    try {
      const messages = await db.message.findMany({
        where: { chatRoomId: req.params.roomId },
      });

      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages from db:", error);
      res.status(500).json({ error: "Error fetching messages from db" });
    }
  });

  // POST
  app.post('/api/createRoom', async (req, res) => {
    const createdRoom = await db.chatRoom.create({
      data: {},
    });
    res.json(createdRoom);
  });

  app.post('/rooms/:roomId/sendMessage', async (req, res) => {
    const { messageInput, roomId } = req.body;
    try {
      pusher.trigger(roomId, 'incoming-message', messageInput);

      // Make chats persistent, works also without it, but only until the page gets refreshed
      await db.message.create({
        data: {
          text: messageInput,
          chatRoomId: roomId
        }
      });
      // Respond with a success message
      res.status(200).json({ message: "Message sent and created successfully" });
    } catch (error) {
      console.error("Error handling message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

};
