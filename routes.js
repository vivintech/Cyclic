// src/routes.js
module.exports = (app, db, pusher) => {

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

};
