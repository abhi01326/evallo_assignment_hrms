const Employee = require("../models/employeeModel");
const Assignment = require("../models/assignmentModel");
const logger = require("../utils/logger");

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.getEmployees();
    // Attach teams for each employee
    const withTeams = await Promise.all(
      employees.map(async (e) => {
        const teams = await Assignment.getTeamsForEmployee(e.id);
        return { ...e, teams };
      })
    );
    res.status(200).json(withTeams);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving employees", error: error.message });
  }
};

const addEmployee = async (req, res) => {
  const { name, position, department, teamIds } = req.body;
  try {
    const id = await Employee.createEmployee({ name, position, department });
    // assign to teams if provided
    if (Array.isArray(teamIds)) {
      for (const t of teamIds) {
        await Assignment.assignEmployeeToTeam(id, t);
        await logger.logAction(
          "employee_assigned",
          req.user?.id || null,
          `employee:${id},team:${t}`
        );
      }
    }
    await logger.logAction(
      "employee_created",
      req.user?.id || null,
      `employee:${id}`
    );
    res.status(201).json({ id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating employee", error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await Employee.deleteEmployee(id);
    await logger.logAction(
      "employee_deleted",
      req.user?.id || null,
      `employee:${id}`
    );
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee: async (req, res) => {
    const { id } = req.params;
    const { name, position, department, teamIds } = req.body;
    try {
      await Employee.updateEmployee(id, { name, position, department });
      // reset assignments if provided
      if (Array.isArray(teamIds)) {
        const Assignment = require("../models/assignmentModel");
        // remove all existing assignments for employee
        const current = await Assignment.getTeamsForEmployee(id);
        for (const t of current) {
          await Assignment.removeEmployeeFromTeam(id, t.id);
        }
        for (const t of teamIds) {
          await Assignment.assignEmployeeToTeam(id, t);
        }
      }
      const logger = require("../utils/logger");
      await logger.logAction(
        "employee_updated",
        req.user?.id || null,
        `employee:${id}`
      );
      res.status(200).json({ message: "Updated" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating employee", error: err.message });
    }
  },
};
