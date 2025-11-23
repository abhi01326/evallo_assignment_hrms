const db = require("../db/db");

class UserModel {
  async createUser(organisation_name, password, email) {
    const insertUserQuery = `INSERT INTO users (organisation_name, password, email) VALUES (?, ?, ?)`;
    const res = await db.run(insertUserQuery, [
      organisation_name,
      password,
      email,
    ]);
    return res.lastID || res.lastInsertRowid || null;
  }

  async getUserByEmail(email) {
    const selectUserQuery = `SELECT * FROM users WHERE email = ?`;
    return await db.get(selectUserQuery, [email]);
  }

  async getUserById(id) {
    const selectUserQuery = `SELECT * FROM users WHERE id = ?`;
    return await db.get(selectUserQuery, [id]);
  }

  async updateUser(id, organisation_name, email) {
    const updateUserQuery = `UPDATE users SET organisation_name = ?, email = ? WHERE id = ?`;
    await db.run(updateUserQuery, [organisation_name, email, id]);
  }

  async deleteUser(id) {
    const deleteUserQuery = `DELETE FROM users WHERE id = ?`;
    await db.run(deleteUserQuery, [id]);
  }
}

module.exports = new UserModel();
