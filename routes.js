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

  app.post('/room/:roomId/api/message', async (req, res) => {
    const { messageInput, roomId } = req.body;
    try {
      pusher.trigger(roomId, 'incoming-message', messageInput);
    } catch (error) {
      console.error("Error handling message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

    // Make chats persistent, works also without it, but only until the page gets refreshed
    await db.message.create({
      data: {
        chatRoomId: roomId,
        text: messageInput
      },
    }) 
  });

};
