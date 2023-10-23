const express = require("express");
const router = express.Router();
const { rooms, users, ROLE } = require("../data");
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

router.post("/", authUser, (req, res) => {
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

router.put("/:roomId", authUser, setRoom, (req, res) => {
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

router.delete("/:roomId", authUser, setRoom, (req, res) => {
  const roomId = parseInt(req.params.roomId);

  const roomIndex = rooms.findIndex((room) => room.id === roomId);

  if (roomIndex !== -1) {
    rooms.splice(roomIndex, 1);
    res.json({ message: "Room deleted successfully" });
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

router.get("/:roomId/users", authUser, setRoom, (req, res) => {
  const roomId = parseInt(req.params.roomId);

  const room = rooms.find((room) => room.id === roomId);

  if (room) {
    res.json(room.members);
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

router.put(
  "/:roomId/members/:memberName",
  authUser,
  setRoom,
  authRole(ROLE.ADMIN),
  (req, res) => {
    const room = req.room;
    const oldMemberName = req.params.memberName;
    const newMemberName = req.body.newMemberName;

    if (room) {
      const memberIndex = room.members.findIndex(
        (member) => member === oldMemberName
      );

      if (memberIndex !== -1) {
        room.members[memberIndex] = newMemberName;
        res.json({ message: "Member details updated successfully" });
      } else {
        res.status(404).json({ message: "Member not found in the room" });
      }
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  }
);

router.post("/:roomId/users", authUser, setRoom, (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const userId = req.body.userId;

  const room = rooms.find((room) => room.id === roomId);

  if (room) {
    const user = users.find((user) => user.id === userId);
    if (user) {
      room.members.push(user);
      res.json({ message: "User added to room successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

router.get("/:roomId/members/:memberName", authUser, setRoom, (req, res) => {
  const room = req.room;
  const memberName = req.params.memberName;

  if (room) {
    const member = room.members.find((member) => member === memberName);

    if (member) {
      res.json({ member });
    } else {
      res.status(404).json({ message: "Member not found in the room" });
    }
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

// Remove user from room
router.delete("/:roomId/users/:userId", authUser, setRoom, (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const userId = parseInt(req.params.userId);

  const room = rooms.find((room) => room.id === roomId);

  if (room) {
    const userIndex = room.members.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      room.members.splice(userIndex, 1);
      res.json({ message: "User removed from room successfully" });
    } else {
      res.status(404).json({ message: "User not found in room" });
    }
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

router.post(
  "/:roomId/messages/:messageId/like",
  authUser,
  setRoom,
  (req, res) => {
    const roomId = parseInt(req.params.roomId);
    const messageId = parseInt(req.params.messageId);

    const room = rooms.find((room) => room.id === roomId);

    if (room) {
      const message = room.messages.find((message) => message.id === messageId);

      if (message) {
        message.likes = message.likes || [];
        message.likes.push(req.user.id);
        res.json({ message: "Like added successfully" });
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  }
);

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
