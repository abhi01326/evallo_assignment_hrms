const Team = require("../models/teamModel");
const Assignment = require("../models/assignmentModel");
const logger = require("../utils/logger");

const getTeams = async (req, res) => {
  try {
    const teams = await Team.getAllTeams();
    const withMembers = await Promise.all(
      teams.map(async (t) => {
        const members = await Assignment.getEmployeesForTeam(t.id);
        return { ...t, members };
      })
    );
    res.status(200).json(withMembers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving teams", error: error.message });
  }
};

const addTeam = async (req, res) => {
  const { name, lead } = req.body;
  try {
    const newTeam = await Team.createTeam(name, lead);
    await logger.logAction(
      "team_created",
      req.user?.id || null,
      `team:${newTeam.id}`
    );
    res.status(201).json(newTeam);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating team", error: error.message });
  }
};

const deleteTeam = async (req, res) => {
  const { id } = req.params;
  try {
    await Team.deleteTeam(id);
    await logger.logAction("team_deleted", req.user?.id || null, `team:${id}`);
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting team", error: error.message });
  }
};

module.exports = {
  getTeams,
  addTeam,
  deleteTeam,
};
