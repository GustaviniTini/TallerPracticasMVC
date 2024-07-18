const Team = require('../models/Team');

const createTeam = async ({ name, players }) => {
    const newTeam = new Team({ name, players });
    await newTeam.save();
    return newTeam;
};

const getAllTeams = async () => {
    return await Team.find().populate('players', 'name stats');
};

const getTeamById = async (id) => {
    const team = await Team.findById(id).populate('players', 'name stats');
    if (!team) throw new Error('Equipo no encontrado');
    return team;
};

const updateTeam = async (id, { name, players, stats }) => {
    const team = await Team.findByIdAndUpdate(id, { name, players, stats }, { new: true });
    if (!team) throw new Error('Equipo no encontrado');
    return team;
};

const deleteTeam = async (id) => {
    const team = await Team.findByIdAndDelete(id);
    if (!team) throw new Error('Equipo no encontrado');
};

module.exports = { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam };
