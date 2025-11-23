const express = require("express");
const router = express.Router();
const employeesController = require("../controllers/employeesController");
const teamsController = require("../controllers/teamsController");
const authMiddleware = require("../middleware/authMiddleware");
const assignmentModel = require("../models/assignmentModel");
const logger = require("../utils/logger");
const logsController = require('../controllers/logsController');

// Employee Routes
router.get(
  "/employees",
  authMiddleware.authenticateToken,
  employeesController.getEmployees
);
router.post(
  "/employees",
  authMiddleware.authenticateToken,
  employeesController.addEmployee
);
router.delete(
  "/employees/:id",
  authMiddleware.authenticateToken,
  employeesController.deleteEmployee
);

// Update employee
router.put(
  "/employees/:id",
  authMiddleware.authenticateToken,
  async (req, res) => {
    try {
      await employeesController.updateEmployee(req, res);
    } catch (err) {
      res.status(500).json({ message: "Error updating employee" });
    }
  }
);

// Team Routes
router.get(
  "/teams",
  authMiddleware.authenticateToken,
  teamsController.getTeams
);
router.post(
  "/teams",
  authMiddleware.authenticateToken,
  teamsController.addTeam
);
router.delete(
  "/teams/:id",
  authMiddleware.authenticateToken,
  teamsController.deleteTeam
);

// Assign employee to team
router.post(
  "/assignments",
  authMiddleware.authenticateToken,
  async (req, res) => {
    const { employeeId, teamId } = req.body;
    try {
      await assignmentModel.assignEmployeeToTeam(employeeId, teamId);
      await logger.logAction(
        "employee_assigned",
        req.user?.id || null,
        `employee:${employeeId},team:${teamId}`
      );
      res.status(200).json({ message: "Assigned" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Assignment failed", error: err.message });
    }
  }
);

router.delete(
  "/assignments",
  authMiddleware.authenticateToken,
  async (req, res) => {
    const { employeeId, teamId } = req.body;
    try {
      await assignmentModel.removeEmployeeFromTeam(employeeId, teamId);
      await logger.logAction(
        "employee_unassigned",
        req.user?.id || null,
        `employee:${employeeId},team:${teamId}`
      );
      res.status(200).json({ message: "Unassigned" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Unassignment failed", error: err.message });
    }
  }
);

// Logs
router.get('/logs', authMiddleware.authenticateToken, logsController.getLogs);

module.exports = router;
