const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "hrms.db");

const getDb = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  return db;
};

module.exports = {
  run: async (sql, params = []) => {
    const db = await getDb();
    const res = await db.run(sql, params);
    await db.close();
    return res;
  },
  get: async (sql, params = []) => {
    const db = await getDb();
    const res = await db.get(sql, params);
    await db.close();
    return res;
  },
  all: async (sql, params = []) => {
    const db = await getDb();
    const res = await db.all(sql, params);
    await db.close();
    return res;
  },
};
