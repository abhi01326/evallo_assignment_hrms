const db = require("../db/db");

const logAction = async (action, userId = null, details = null) => {
  try {
    await db.run(
      "INSERT INTO logs (action, user_id, details) VALUES (?, ?, ?)",
      [action, userId, details]
    );
  } catch (err) {
    console.error("Failed to write log:", err.message || err);
  }
};

module.exports = { logAction };
