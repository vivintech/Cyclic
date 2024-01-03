// src/routes.js
module.exports = (app, db) => {
  app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
  });

  app.post('/rooms', async (req, res) => {
    const createdRoom = await db.chatRoom.create({
      data: {},
    });
    res.json({ roomId: createdRoom.id });
  });

  app.get('/rooms', async (req, res) => {
    const rooms = await db.chatRoom.findMany();
    res.json(rooms);
  });


  /*     app.post('/join-room/:roomId', async (req, res) => {
        const { roomId } = req.params;
    
        const room = await prisma.room.findUnique({
          where: {
            id: parseInt(roomId),
          },
        });
    
        if (!room) {
          return res.status(404).json({ error: 'Room not found' });
        }
    
        // Implement logic for joining a room
    
        res.json({ message: 'Successfully joined the room' });
      }); */
};
