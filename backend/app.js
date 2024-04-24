// var express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// app.get("/", (req, res) => {
//   res.send("OK");
// });

const rooms = [];
const roomMap = {};

const findRoom = () => {
  const room = rooms.find(room => room.count < 2);
  if (room) {
    return room;
  } else {
    const newRoom = {
      id: rooms.length,
      count: 0,
    };
    rooms.push(newRoom);
    return newRoom;
  }
}

io.on("connection", (socket) => {
  socket.on("join", (arg) => {
    console.log("arg: ", arg);

    const room = findRoom();
    room.count += 1;

    roomMap[socket.id] = room.id;

    socket.join(room.id);
  });

  socket.on("signal", () => {
    const roomId = roomMap[socket.id];
    console.log("my room id: ", roomId);

    console.log()

    socket.to(roomId).emit("signal");
  })

  socket.on("message", (data, callback) => {
    socket.rooms.forEach((roomId) => {
      socket.to(roomId).emit("message", data);
      callback({ status: 200 });
    })
  })
  console.log(socket.rooms);
});

httpServer.listen(4000, () => console.log("app is listening"));
