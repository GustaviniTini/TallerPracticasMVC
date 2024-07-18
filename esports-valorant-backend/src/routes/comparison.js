const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    comparePlayers,
    getBestPlayerByAgent,
    getBestPlayerByMap,
    compareTeamsOnMap,
    getPlayerLeaderboard,
    getTeamLeaderboard,
    getPlayerPerformanceTrend,
    getPlayerBestAgents,
    getTeamMapPerformance
} = require('../services/comparisonService');

// Ruta para comparar estadísticas generales de dos jugadores
router.get('/compare-players', [auth], async (req, res) => {
    try {
        const comparison = await comparePlayers(req.query);
        res.status(200).json(comparison);
    } catch (err) {
        res.status(400).send('Error al comparar jugadores: ' + err.message);
    }
});

// Ruta para obtener el mejor jugador con un agente específico
router.get('/best-player-agent', [auth], async (req, res) => {
    try {
        const bestPlayer = await getBestPlayerByAgent(req.query);
        res.status(200).json(bestPlayer);
    } catch (err) {
        res.status(400).send('Error al obtener el mejor jugador con el agente específico: ' + err.message);
    }
});

// Ruta para obtener el mejor jugador en un mapa específico
router.get('/best-player-map', [auth], async (req, res) => {
    try {
        const bestPlayer = await getBestPlayerByMap(req.query);
        res.status(200).json(bestPlayer);
    } catch (err) {
        res.status(400).send('Error al obtener el mejor jugador en el mapa específico: ' + err.message);
    }
});

// Ruta para comparar estadísticas de dos equipos en un mapa específico
router.get('/compare-teams-map', [auth], async (req, res) => {
    try {
        const comparisonResult = await compareTeamsOnMap(req.query);
        res.status(200).json(comparisonResult);
    } catch (err) {
        res.status(400).send('Error al comparar equipos en el mapa específico: ' + err.message);
    }
});

// Ruta para obtener el leaderboard de jugadores
router.get('/leaderboard', [auth], async (req, res) => {
    try {
        const topPlayers = await getPlayerLeaderboard();
        res.status(200).json(topPlayers);
    } catch (err) {
        res.status(400).send('Error al obtener el leaderboard: ' + err.message);
    }
});

// Ruta para obtener el leaderboard de equipos
router.get('/leaderboard-teams', [auth], async (req, res) => {
    try {
        const topTeams = await getTeamLeaderboard();
        res.status(200).json(topTeams);
    } catch (err) {
        res.status(400).send('Error al obtener el leaderboard: ' + err.message);
    }
});

// Ruta para obtener la tendencia de rendimiento de un jugador
router.get('/player-performance-trend', [auth], async (req, res) => {
    try {
        const performanceTrend = await getPlayerPerformanceTrend(req.query);
        res.status(200).json(performanceTrend);
    } catch (err) {
        res.status(400).send('Error al obtener la tendencia de rendimiento del jugador: ' + err.message);
    }
});

// Ruta para obtener los mejores agentes de un jugador
router.get('/player-best-agents', [auth], async (req, res) => {
    try {
        const bestAgents = await getPlayerBestAgents(req.query);
        res.status(200).json(bestAgents);
    } catch (err) {
        res.status(400).send('Error al obtener los mejores agentes del jugador: ' + err.message);
    }
});

// Ruta para obtener el rendimiento de un equipo en los mapas
router.get('/team-map-performance', [auth], async (req, res) => {
    try {
        const performance = await getTeamMapPerformance(req.query);
        res.status(200).json(performance);
    } catch (err) {
        res.status(400).send('Error al obtener el rendimiento del equipo en los mapas: ' + err.message);
    }
});

module.exports = router;
