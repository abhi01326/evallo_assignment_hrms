const jwt = require("jsonwebtoken");

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return response.sendStatus(401);
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  jwt.verify(token, secret, (err, user) => {
    if (err) return response.sendStatus(403);
    request.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
