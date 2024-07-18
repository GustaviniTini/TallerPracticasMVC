const Match = require('../models/Match');
const Team = require('../models/Team');
const Player = require('../models/Player');

const calculateWinner = (match) => {
    const team1Wins = match.maps.filter(map => map.team1Score > map.team2Score).length;
    const team2Wins = match.maps.filter(map => map.team2Score > map.team1Score).length;

    if (team1Wins > team2Wins) {
        match.winner = match.team1;
        match.scores.team1Score = team1Wins;
        match.scores.team2Score = team2Wins;
    } else {
        match.winner = match.team2;
        match.scores.team1Score = team1Wins;
        match.scores.team2Score = team2Wins;
    }
};

const revertStatistics = async (match) => {
    const team1 = await Team.findById(match.team1).populate('players');
    const team2 = await Team.findById(match.team2).populate('players');

    team1.stats.totalGames = Math.max(0, team1.stats.totalGames - 1);
    team2.stats.totalGames = Math.max(0, team2.stats.totalGames - 1);

    if (match.winner.equals(match.team1)) {
        team1.stats.wins = Math.max(0, team1.stats.wins - 1);
        team2.stats.losses = Math.max(0, team2.stats.losses - 1);
    } else {
        team1.stats.losses = Math.max(0, team1.stats.losses - 1);
        team2.stats.wins = Math.max(0, team2.stats.wins - 1);
    }

    for (const map of match.maps) {
        for (const playerStat of map.stats) {
            const player = await Player.findById(playerStat.player);
            if (player) {
                player.stats.kills = Math.max(0, player.stats.kills - playerStat.kills);
                player.stats.deaths = Math.max(0, player.stats.deaths - playerStat.deaths);
                player.stats.assists = Math.max(0, player.stats.assists - playerStat.assists);
                await player.save();
            }
        }
    }

    await team1.save();
    await team2.save();
};

const updateStatistics = async (match) => {
    const team1 = await Team.findById(match.team1).populate('players');
    const team2 = await Team.findById(match.team2).populate('players');

    team1.stats.totalGames += 1;
    team2.stats.totalGames += 1;

    if (match.winner.equals(match.team1)) {
        team1.stats.wins += 1;
        team2.stats.losses += 1;
    } else {
        team1.stats.losses += 1;
        team2.stats.wins += 1;
    }

    for (const map of match.maps) {
        for (const playerStat of map.stats) {
            const player = await Player.findById(playerStat.player);
            if (player) {
                player.stats.kills += playerStat.kills;
                player.stats.deaths += playerStat.deaths;
                player.stats.assists += playerStat.assists;
                await player.save();
            }
        }
    }

    await team1.save();
    await team2.save();
};

const createMatch = async ({ team1, team2, maps }) => {
    if (maps.length !== 3) {
        throw new Error('Debe proporcionar exactamente 3 mapas.');
    }

    const team1Data = await Team.findById(team1).populate('players');
    const team2Data = await Team.findById(team2).populate('players');

    if (!team1Data || !team2Data) {
        throw new Error('Los equipos proporcionados no son válidos.');
    }

    const newMaps = maps.map(map => ({
        map: map.mapId,  // Cambia de mapId a map
        team1Score: map.team1Score,
        team2Score: map.team2Score,
        stats: [
            ...team1Data.players.map(player => ({
                player: player._id,
                agent: map.stats[player._id]?.agent,
                kills: map.stats[player._id]?.kills || 0,
                deaths: map.stats[player._id]?.deaths || 0,
                assists: map.stats[player._id]?.assists || 0
            })),
            ...team2Data.players.map(player => ({
                player: player._id,
                agent: map.stats[player._id]?.agent,
                kills: map.stats[player._id]?.kills || 0,
                deaths: map.stats[player._id]?.deaths || 0,
                assists: map.stats[player._id]?.assists || 0
            }))
        ]
    }));

    const newMatch = new Match({ team1, team2, maps: newMaps });

    calculateWinner(newMatch);
    await newMatch.save();
    await updateStatistics(newMatch);

    return await Match.findById(newMatch._id)
        .populate('team1', 'name')
        .populate('team2', 'name')
        .populate('winner', 'name')
        .populate('maps.map', 'name') // Asegúrate de poblar los nombres de los mapas
        .populate('maps.stats.player', 'name')
        .populate('maps.stats.agent', 'name'); // Añadir agente a la población
};

const getAllMatches = async () => {
    return await Match.find()
        .populate('team1 team2', 'name')
        .populate('winner', 'name')
        .populate('maps.map', 'name') // Asegúrate de poblar los nombres de los mapas
        .populate('maps.stats.player', 'name')
        .populate('maps.stats.agent', 'name'); // Añadir agente a la población
};

const getMatchById = async (id) => {
    const match = await Match.findById(id)
        .populate('team1 team2', 'name')
        .populate('winner', 'name')
        .populate('maps.map', 'name') // Asegúrate de poblar los nombres de los mapas
        .populate('maps.stats.player', 'name')
        .populate('maps.stats.agent', 'name'); // Añadir agente a la población

    if (!match) throw new Error('Partido no encontrado');
    return match;
};

const updateMatch = async (id, { team1, team2, maps }) => {
    if (maps.length !== 3) {
        throw new Error('Debe proporcionar exactamente 3 mapas.');
    }

    const match = await Match.findById(id);

    if (!match) throw new Error('Partido no encontrado');

    // Revertir las estadísticas antes de actualizar el partido
    await revertStatistics(match);

    const team1Data = await Team.findById(team1).populate('players');
    const team2Data = await Team.findById(team2).populate('players');

    if (!team1Data || !team2Data) {
        throw new Error('Los equipos proporcionados no son válidos.');
    }

    match.team1 = team1;
    match.team2 = team2;
    match.maps = maps.map(map => ({
        map: map.mapId,  // Asegúrate de que `map` está siendo asignado correctamente
        team1Score: map.team1Score,
        team2Score: map.team2Score,
        stats: [
            ...team1Data.players.map(player => ({
                player: player._id,
                agent: map.stats[player._id]?.agent,
                kills: map.stats[player._id]?.kills || 0,
                deaths: map.stats[player._id]?.deaths || 0,
                assists: map.stats[player._id]?.assists || 0
            })),
            ...team2Data.players.map(player => ({
                player: player._id,
                agent: map.stats[player._id]?.agent,
                kills: map.stats[player._id]?.kills || 0,
                deaths: map.stats[player._id]?.deaths || 0,
                assists: map.stats[player._id]?.assists || 0
            }))
        ]
    }));

    calculateWinner(match);
    await match.save();
    await updateStatistics(match);

    return await Match.findById(match._id)
        .populate('team1', 'name')
        .populate('team2', 'name')
        .populate('winner', 'name')
        .populate('maps.map', 'name') // Asegúrate de poblar los nombres de los mapas
        .populate('maps.stats.player', 'name')
        .populate('maps.stats.agent', 'name'); // Añadir agente a la población
};

const deleteMatch = async (id) => {
    const match = await Match.findById(id);
    if (!match) throw new Error('Partido no encontrado');

    // Revertir las estadísticas antes de eliminar el partido
    await revertStatistics(match);

    await Match.findByIdAndDelete(id);
};

module.exports = {
    createMatch,
    getAllMatches,
    getMatchById,
    updateMatch,
    deleteMatch
};
