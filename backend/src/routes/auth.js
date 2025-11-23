const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware.authenticateToken, (req, res) => {
  // delegate to controller to log out
  const { logoutUser } = require("../controllers/authController");
  return logoutUser(req, res);
});

module.exports = router;
