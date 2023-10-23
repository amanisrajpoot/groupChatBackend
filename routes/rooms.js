const express = require("express");
const router = express.Router();
const { rooms } = require("../data");
const { authRole, authUser } = require("../auth");
const {
  canViewRoom,
  scopedRooms,
  canDeleteRoom,
  canAddRoom,
  canEditRoom,
} = require("../permissions/room");

router.get("/", authUser, (req, res) => {
  res.json(rooms);
});

router.post("/", authUser, authAddRoom, (req, res) => {
  const { roomName } = req.body;

  if (!rooms.some((room) => room.name === roomName)) {
    rooms.push({
      name: roomName,
      members: [],
      createdBy: "",
      admins: [],
      messages: [],
    });
    res.status(201).json({ message: "Room created successfully" });
  } else {
    res.status(400).json({ message: "Room already exists" });
  }
});

router.get("/:roomId", authUser, setRoom, (req, res) => {
  const roomId = parseInt(req.params.roomId);

  const room = rooms.find((room) => room.id === roomId);

  if (rooms !== null) {
    res.json(room);
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

router.put("/:roomId", authUser, setRoom, authEditRoom, (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const updatedRoom = req.body;

  const roomIndex = rooms.findIndex((room) => room.id === roomId);

  if (roomIndex !== -1) {
    rooms[roomIndex] = updatedRoom;
    res.json({ message: "Room updated successfully" });
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

router.delete("/:roomId", authUser, setRoom, authDeleteRoom, (req, res) => {
  const roomId = parseInt(req.params.roomId);

  const roomIndex = rooms.findIndex((room) => room.id === roomId);

  if (roomIndex !== -1) {
    rooms.splice(roomIndex, 1);
    res.json({ message: "Room deleted successfully" });
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

// Message Handling
router.get("/:roomId/messages", authUser, setRoom, (req, res) => {
  const roomId = parseInt(req.params.roomId);

  const room = rooms.find((room) => room.id === roomId);

  if (room) {
    res.json(room.messages);
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

router.post("/:roomId/messages", authUser, setRoom, (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const message = req.body.message;
  const sentAt = new Date();

  const room = rooms.find((room) => room.id === roomId);

  if (room) {
    room.messages.push({ sentAt, message, sentBy: req.user.id });
    res.json({ message: "Message sent successfully" });
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

function setRoom(req, res, next) {
  const roomId = parseInt(req.params.roomId);
  console.log("room ID", roomId);
  req.room = rooms.find((room) => room.id === roomId);

  if (req.room == null) {
    res.status(404);
    return res.send("Room not found");
  }
  next();
}

function authGetRoom(req, res, next) {
  if (!canViewRoom(req.user, req.room)) {
    res.status(401);
    return res.send("Not Allowed");
  }
  next();
}

function authAddRoom(req, res, next) {
  if (!canAddRoom(req.user, req.room)) {
    res.status(401);
    return res.send("Not Allowed");
  }
  next();
}

function authEditRoom(req, res, next) {
  if (!canEditRoom(req.user, req.room)) {
    res.status(401);
    return res.send("Not Allowed");
  }
  next();
}

function authDeleteRoom(req, res, next) {
  if (!canDeleteRoom(req.user, req.room)) {
    res.status(401);
    return res.send("Not Allowed");
  }
  next();
}

module.exports = router;
