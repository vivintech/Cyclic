// src/routes.js
module.exports = (app, db) => {

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
    res.json({ roomId: createdRoom.id });
  });

};
