const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

(async () => {
  const dbPath = path.join(__dirname, "..", "src", "db", "hrms.db");
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  try {
    console.log("Opening DB for migration:", dbPath);

    // Ensure logs.details column exists (SQLite supports ADD COLUMN)
    const logsInfo = await db.all("PRAGMA table_info('logs')");
    const hasDetails = logsInfo.some((c) => c.name === "details");
    if (!hasDetails) {
      console.log("Adding 'details' column to logs table...");
      await db.run("ALTER TABLE logs ADD COLUMN details TEXT");
    } else {
      console.log("'details' column already exists on logs");
    }

    // Create employee_teams join table if missing
    await db.run(`CREATE TABLE IF NOT EXISTS employee_teams (
      employee_id INTEGER NOT NULL,
      team_id INTEGER NOT NULL,
      PRIMARY KEY (employee_id, team_id),
      FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE
    )`);
    console.log("Ensured employee_teams table exists");

    // If employees.team_id exists, migrate existing assignments into join table
    const empInfo = await db.all("PRAGMA table_info('employees')");
    const hasTeamId = empInfo.some((c) => c.name === "team_id");
    if (hasTeamId) {
      console.log(
        "Found employees.team_id column — migrating values into employee_teams"
      );
      const rows = await db.all(
        "SELECT id, team_id FROM employees WHERE team_id IS NOT NULL"
      );
      for (const r of rows) {
        try {
          await db.run(
            "INSERT OR IGNORE INTO employee_teams (employee_id, team_id) VALUES (?, ?)",
            [r.id, r.team_id]
          );
        } catch (e) {
          console.warn(
            "Failed to insert employee_teams row",
            r,
            e.message || e
          );
        }
      }
      console.log("Migration of team_id values complete");
    } else {
      console.log(
        "employees.team_id not present — no per-row migration needed"
      );
    }

    console.log("Migration finished successfully");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await db.close();
  }
})();
