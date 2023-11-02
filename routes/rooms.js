const express = require("express");
const router = express.Router();
const { rooms, users, ROLE } = require("../data");
const { authRole, authUser } = require("../auth");

const Room = require("../models/rooms");

router.get("/", authUser, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", authUser, async (req, res) => {
  try {
    const { name, members } = req.body;
    console.log("Received request with name:", name);
    console.log("Received request with members:", members);

    await createRoom(name, members, req.user.name);

    res.status(201).json({ message: "Room created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function createRoom(name, members, createdBy) {
  const existingRoom = await Room.findOne({ name });

  if (existingRoom) {
    throw new Error("Room already exists");
  }

  const newRoom = new Room({
    name,
    members,
    createdBy,
    admins: [createdBy],
  });

  await newRoom.save();
}

router.get("/:roomId", authUser, async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:roomId", authUser, async (req, res) => {
  const roomId = req.params.roomId;
  const updatedRoom = req.body;

  try {
    const room = await Room.findByIdAndUpdate(roomId, updatedRoom);

    if (room) {
      res.json({ message: "Room updated successfully" });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:roomId", authUser, async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findByIdAndDelete(roomId);

    if (room) {
      res.json({ message: "Room deleted successfully" });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:roomId/users", authUser, async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (room) {
      res.json(room.members);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:roomId/members/:memberName", authUser, async (req, res) => {
  const roomId = req.params.roomId;
  const oldMemberName = req.params.memberName;
  const newMemberName = req.body.newMemberName;

  try {
    const room = await Room.findById(roomId);

    if (room) {
      const memberIndex = room.members.findIndex(
        (member) => member === oldMemberName
      );

      if (memberIndex !== -1) {
        room.members[memberIndex] = newMemberName;
        await room.save();
        res.json({ message: "Member details updated successfully" });
      } else {
        res.status(404).json({ message: "Member not found in the room" });
      }
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:roomId/users", authUser, async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.body.userId;

  try {
    const room = await Room.findById(roomId);

    if (room) {
      room.members.push(userId);
      await room.save();
      res.json({ message: "User added to room successfully" });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:roomId/members/:memberName", authUser, async (req, res) => {
  const roomId = req.params.roomId;
  const memberName = req.params.memberName;

  try {
    const room = await Room.findById(roomId);

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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:roomId/users/:userId", authUser, async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.params.userId;

  try {
    const room = await Room.findById(roomId);

    if (room) {
      const userIndex = room.members.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        room.members.splice(userIndex, 1);
        await room.save();
        res.json({ message: "User removed from room successfully" });
      } else {
        res.status(404).json({ message: "User not found in room" });
      }
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:roomId/messages", authUser, async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (room) {
      res.json(room.messages);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:roomId/messages", authUser, async (req, res) => {
  const roomId = req.params.roomId;
  const message = req.body.message;
  const sentAt = new Date();

  try {
    const room = await Room.findById(roomId);

    if (room) {
      room.messages.push({ sentAt, message, sentBy: req.user.id });
      await room.save();
      res.json({ message: "Message sent successfully" });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:roomId/messages/:messageId/like", authUser, async (req, res) => {
  const roomId = req.params.roomId;
  const messageId = req.params.messageId;

  try {
    const room = await Room.findById(roomId);

    if (room) {
      const message = room.messages.find((message) => message.id === messageId);

      if (message) {
        message.likes = message.likes || [];
        message.likes.push(req.user.id);
        await room.save();
        res.json({ message: "Like added successfully" });
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
