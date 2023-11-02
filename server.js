require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const { users, ROLE, rooms } = require("./data");
const { authRole, authUser } = require("./auth");
const usersRouter = require("./routes/users");
const roomsRouter = require("./routes/rooms");

app.use(express.json());
app.use(setUser);
app.use("/users", usersRouter);
app.use("/rooms", roomsRouter);

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

app.get("/", authUser, (req, res) => {
  res.send("Home Page");
});

app.get("/dashboard", authUser, (req, res) => {
  res.send("Dashboard Page");
});

app.get("/admin", authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send("Admin Page");
});

function setUser(req, res, next) {
  const userId = req.body.userId;
  if (userId) {
    req.user = users.find((user) => user.id === userId);
  }
  next();
}

console.log();

//require('crypto').randomBytes(64).toString('hex')

// app.use((err, req, res, next) => {
//   //console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

app.listen(PORT);

module.exports = app;
