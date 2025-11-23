const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const register = async (req, res) => {
  const { organisation_name, email, password } = req.body;
  if (!organisation_name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertSql = `INSERT INTO users (organisation_name, password, email) VALUES (?, ?, ?)`;
    const result = await db.run(insertSql, [
      organisation_name,
      hashedPassword,
      email,
    ]);
    const userId = result.lastID || result.lastInsertRowid || null;
    const logger = require("../utils/logger");
    await logger.logAction(
      "user_registered",
      userId,
      `organisation:${organisation_name}`
    );
    res
      .status(201)
      .json({ message: "User Registered Successfully", id: userId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing credentials" });
  try {
    const selectSql = `SELECT * FROM users WHERE email = ?`;
    const user = await db.get(selectSql, [email]);
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return res.status(400).json({ message: "Invalid Credentials" });
    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "1h",
    });
    const logger = require("../utils/logger");
    await logger.logAction("user_logged_in", user.id, null);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const logger = require("../utils/logger");
    await logger.logAction("user_logged_out", req.user?.id || null, null);
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Error logging out" });
  }
};

module.exports = {
  registerUser: register,
  loginUser: login,
  logoutUser: logout,
};
