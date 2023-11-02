const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  members: [String], // Assuming member names are stored as strings
  createdBy: String, // Assuming this is a user ID
  admins: [String], // Assuming admin names are stored as strings
  messages: [
    {
      sentAt: Date,
      message: String,
      sentBy: String, // Assuming message sender names are stored as strings
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
