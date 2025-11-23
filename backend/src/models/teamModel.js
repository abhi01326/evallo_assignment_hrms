const db = require('../db/db');

class Team {
    constructor(id, name, lead) {
        this.id = id;
        this.name = name;
        this.lead = lead;
    }

    static async createTeam(name, lead) {
        const insertTeamQuery = `INSERT INTO teams (name, lead) VALUES (?, ?)`;
        const result = await db.run(insertTeamQuery, [name, lead]);
        return new Team(result.lastID, name, lead);
    }

    static async getAllTeams() {
        const getTeamsQuery = `SELECT * FROM teams`;
        const teams = await db.all(getTeamsQuery);
        return teams.map(team => new Team(team.id, team.name, team.lead));
    }

    static async getTeamById(id) {
        const getTeamQuery = `SELECT * FROM teams WHERE id = ?`;
        const team = await db.get(getTeamQuery, [id]);
        return new Team(team.id, team.name, team.lead);
    }

    static async updateTeam(id, name, lead) {
        const updateTeamQuery = `UPDATE teams SET name = ?, lead = ? WHERE id = ?`;
        await db.run(updateTeamQuery, [name, lead, id]);
        return new Team(id, name, lead);
    }

    static async deleteTeam(id) {
        const deleteTeamQuery = `DELETE FROM teams WHERE id = ?`;
        await db.run(deleteTeamQuery, [id]);
    }
}

module.exports = Team;