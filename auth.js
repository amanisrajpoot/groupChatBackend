const jwt = require("jsonwebtoken");

function authUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.sendStatus(403); // Send Forbidden status if token is invalid
    }
    req.user = user;
    next();
  });
}

function authRole(role) {
  return (req, res, next) => {
    console.log("current user role", req.user.role);
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Not Allowed");
    }
    next();
  };
}

module.exports = {
  authRole,
  authUser,
};
