const express = require("express");
const router = express.Router();
const { users, ROLE } = require("../data");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authRole, authUser } = require("../auth");
const Users = require("../models/users");
const RefreshTokens = require("../models/refreshTokens");

let refreshTokens = [];

router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:userId", getUser, async (req, res) => {
  res.json(res.user);
});

router.post("/", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new Users({
      name: req.body.name,
      password: hashedPassword,
      role: req.body.role,
    });

    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } catch {
    res.status(500).send();
  }
});

router.patch("/:userId", authUser, getUser, async (req, res) => {
  try {
    if (req.body.name != null) {
      res.user.name = req.body.name;
    }
    if (req.body.role != null) {
      res.user.role = req.body.role;
    }
    try {
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:userId", authUser, getUser, async (req, res) => {
  try {
    try {
      await res.user.remove();
      res.json({ message: "Deleted User" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!RefreshTokens.findOne({ refreshToken: req.body.token }))
    return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

router.delete("/logout", async (req, res) => {
  try {
    const token = req.header("Authorization");
    console.log("Received token:", token);
    // ...
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ name: req.body.name }).exec();
    if (user == null) {
      return res.status(400).send("Cannot find user");
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordValid) {
      const accessToken = jwt.sign(
        user.toJSON(),
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "14400s",
        }
      );
      const refreshToken = new RefreshTokens({
        refreshToken: jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET),
      });
      const newRefreshToken = await refreshToken.save();
      console.log("authorization token", accessToken);
      res.json({
        accessToken: accessToken,
        refreshToken: newRefreshToken.refreshToken,
      });
    } else {
      res.send("Not Allowed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await Users.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "14400s",
  });
}

module.exports = router;
