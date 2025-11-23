const db = require("../db/db");

const getEmployees = async () => {
  return await db.all("SELECT id, name, position, department FROM employees");
};

const getEmployeeById = async (id) => {
  return await db.get(
    "SELECT id, name, position, department FROM employees WHERE id = ?",
    [id]
  );
};

const createEmployee = async (employeeData) => {
  const { name, position, department } = employeeData;
  const result = await db.run(
    "INSERT INTO employees (name, position, department) VALUES (?, ?, ?)",
    [name, position, department]
  );
  return result.lastID || result.lastInsertRowid || null;
};

const updateEmployee = async (id, employeeData) => {
  const { name, position, department } = employeeData;
  await db.run(
    "UPDATE employees SET name = ?, position = ?, department = ? WHERE id = ?",
    [name, position, department, id]
  );
};

const deleteEmployee = async (id) => {
  await db.run("DELETE FROM employees WHERE id = ?", [id]);
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
