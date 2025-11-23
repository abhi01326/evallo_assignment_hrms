const fs = require("fs");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

(async () => {
  try {
    const schemaPath = path.join(__dirname, "..", "src", "db", "schema.sql");
    const dbPath = path.join(__dirname, "..", "src", "db", "hrms.db");

    const schema = fs.readFileSync(schemaPath, "utf8");

    const db = await open({ filename: dbPath, driver: sqlite3.Database });
    // sqlite3 `exec` equivalent: run statements sequentially
    const statements = schema
      .split(/;\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      await db.exec(stmt + ";");
    }

    // Seed initial data if tables are empty
    const users = await db.get("SELECT COUNT(1) as c FROM users");
    if (!users || users.c === 0) {
      await db.run(
        "INSERT INTO users (organisation_name, password, email) VALUES (?, ?, ?)",
        ["DemoOrg", "devpassword", "admin@example.com"]
      );
      console.log(
        "Seeded default user: admin@example.com / password: devpassword"
      );
    }

    const teams = await db.get("SELECT COUNT(1) as c FROM teams");
    if (!teams || teams.c === 0) {
      await db.run("INSERT INTO teams (name, lead) VALUES (?, ?)", [
        "Engineering",
        "Alice",
      ]);
      await db.run("INSERT INTO teams (name, lead) VALUES (?, ?)", [
        "HR",
        "Bob",
      ]);
      console.log("Seeded sample teams");
    }

    const employees = await db.get("SELECT COUNT(1) as c FROM employees");
    if (!employees || employees.c === 0) {
      await db.run(
        "INSERT INTO employees (name, position, department) VALUES (?, ?, ?)",
        ["John Doe", "Software Engineer", "Engineering"]
      );
      await db.run(
        "INSERT INTO employees (name, position, department) VALUES (?, ?, ?)",
        ["Jane Smith", "HR Manager", "HR"]
      );
      // Assign employees to teams via join table
      await db.run(
        "INSERT INTO employee_teams (employee_id, team_id) VALUES (?, ?)",
        [1, 1]
      );
      await db.run(
        "INSERT INTO employee_teams (employee_id, team_id) VALUES (?, ?)",
        [2, 2]
      );
      console.log("Seeded sample employees");
    }

    await db.close();
    console.log("Database created/initialized at", dbPath);
  } catch (err) {
    console.error("Failed to initialize DB:", err);
    process.exit(1);
  }
})();
