const db = require("../db/db");

const assignEmployeeToTeam = async (employeeId, teamId) => {
  await db.run(
    "INSERT OR IGNORE INTO employee_teams (employee_id, team_id) VALUES (?, ?)",
    [employeeId, teamId]
  );
};

const removeEmployeeFromTeam = async (employeeId, teamId) => {
  await db.run(
    "DELETE FROM employee_teams WHERE employee_id = ? AND team_id = ?",
    [employeeId, teamId]
  );
};

const getTeamsForEmployee = async (employeeId) => {
  return await db.all(
    `SELECT t.id, t.name, t.lead FROM teams t
     JOIN employee_teams et ON t.id = et.team_id
     WHERE et.employee_id = ?`,
    [employeeId]
  );
};

const getEmployeesForTeam = async (teamId) => {
  return await db.all(
    `SELECT e.id, e.name, e.position, e.department FROM employees e
     JOIN employee_teams et ON e.id = et.employee_id
     WHERE et.team_id = ?`,
    [teamId]
  );
};

module.exports = {
  assignEmployeeToTeam,
  removeEmployeeFromTeam,
  getTeamsForEmployee,
  getEmployeesForTeam,
};
