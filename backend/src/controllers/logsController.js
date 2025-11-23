const db = require("../db/db");

const getLogs = async (req, res) => {
  try {
    const rows = await db.all(
      `SELECT l.id, l.action, l.user_id, l.details, l.timestamp, u.email as user_email
       FROM logs l LEFT JOIN users u ON l.user_id = u.id
       ORDER BY l.timestamp DESC`
    );
    res.status(200).json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching logs", error: err.message });
  }
};

module.exports = { getLogs };
