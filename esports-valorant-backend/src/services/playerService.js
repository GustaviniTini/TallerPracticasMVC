const PlayerFactory = require('../factories/PlayerFactory');
const Player = require('../models/Player');
const Team = require('../models/Team');

const createPlayer = async ({ name, team }) => {
    const player = PlayerFactory.createPlayer({ name, team });
    await player.save();

    if (team) {
        const teamDoc = await Team.findById(team);
        if (teamDoc) {
            teamDoc.players.push(player._id);
            await teamDoc.save();
        }
    }

    return await Player.findById(player._id).populate('team', 'name');
};

const resetPlayerStats = async () => {
    await Player.updateMany({}, {
        $set: {
            "stats.kills": 0,
            "stats.deaths": 0,
            "stats.assists": 0
        }
    });
};

const getAllPlayers = async () => {
    return await Player.find().populate('team', 'name');
};

const getPlayerById = async (id) => {
    const player = await Player.findById(id).populate('team', 'name');
    if (!player) throw new Error('Jugador no encontrado');
    return player;
};

const updatePlayer = async (id, { name, team }) => {
    const player = await Player.findById(id);

    if (!player) throw new Error('Jugador no encontrado');

    if (player.team && player.team.toString() !== team) {
        const oldTeam = await Team.findById(player.team);
        if (oldTeam) {
            oldTeam.players.pull(player._id);
            await oldTeam.save();
        }
    }

    player.name = name;
    player.team = team;
    await player.save();

    const newTeam = await Team.findById(team);
    if (newTeam && !newTeam.players.includes(player._id)) {
        newTeam.players.push(player._id);
        await newTeam.save();
    }

    return player;
};

const deletePlayer = async (id) => {
    const player = await Player.findByIdAndDelete(id);
    if (!player) throw new Error('Jugador no encontrado');

    const team = await Team.findById(player.team);
    if (team) {
        team.players.pull(player._id);
        await team.save();
    }
};

module.exports = { createPlayer, resetPlayerStats, getAllPlayers, getPlayerById, updatePlayer, deletePlayer };
