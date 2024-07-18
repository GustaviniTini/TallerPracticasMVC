const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createPlayer, resetPlayerStats, getAllPlayers, getPlayerById, updatePlayer, deletePlayer } = require('../services/playerService');

// Crear jugador (solo admin)
router.post('/', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        const newPlayer = await createPlayer(req.body);
        res.status(201).json(newPlayer);
    } catch (err) {
        res.status(400).send('Error al crear jugador: ' + err.message);
    }
});

// Restablecer estadísticas de todos los jugadores (solo admin)
router.post('/reset-stats', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await resetPlayerStats();
        res.status(200).send('Estadísticas de todos los jugadores restablecidas');
    } catch (err) {
        res.status(400).send('Error al restablecer estadísticas: ' + err.message);
    }
});

// Obtener todos los jugadores (protegido)
router.get('/', auth, async (req, res) => {
    try {
        const players = await getAllPlayers();
        res.status(200).json(players);
    } catch (err) {
        res.status(400).send('Error al obtener jugadores: ' + err.message);
    }
});

// Obtener un jugador por ID (protegido)
router.get('/:id', auth, async (req, res) => {
    try {
        const player = await getPlayerById(req.params.id);
        res.status(200).json(player);
    } catch (err) {
        res.status(400).send('Error al obtener jugador: ' + err.message);
    }
});

// Actualizar un jugador (solo admin)
router.put('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        const updatedPlayer = await updatePlayer(req.params.id, req.body);
        res.status(200).json(updatedPlayer);
    } catch (err) {
        res.status(400).send('Error al actualizar jugador: ' + err.message);
    }
});

// Eliminar un jugador (solo admin)
router.delete('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await deletePlayer(req.params.id);
        res.status(200).send('Jugador eliminado');
    } catch (err) {
        res.status(400).send('Error al eliminar jugador: ' + err.message);
    }
});

module.exports = router;
