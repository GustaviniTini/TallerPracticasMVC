const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam } = require('../services/teamService');

// Crear equipo (solo admin)
router.post('/', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        const newTeam = await createTeam(req.body);
        res.status(201).send('Equipo creado');
    } catch (err) {
        res.status(400).send('Error al crear equipo: ' + err.message);
    }
});

// Obtener todos los equipos (protegido)
router.get('/', auth, async (req, res) => {
    try {
        const teams = await getAllTeams();
        res.status(200).json(teams);
    } catch (err) {
        res.status(400).send('Error al obtener equipos: ' + err.message);
    }
});

// Obtener un equipo por ID (protegido)
router.get('/:id', auth, async (req, res) => {
    try {
        const team = await getTeamById(req.params.id);
        res.status(200).json(team);
    } catch (err) {
        res.status(400).send('Error al obtener equipo: ' + err.message);
    }
});

// Actualizar un equipo (solo admin)
router.put('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        const updatedTeam = await updateTeam(req.params.id, req.body);
        res.status(200).send('Equipo actualizado');
    } catch (err) {
        res.status(400).send('Error al actualizar equipo: ' + err.message);
    }
});

// Eliminar un equipo (solo admin)
router.delete('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await deleteTeam(req.params.id);
        res.status(200).send('Equipo eliminado');
    } catch (err) {
        res.status(400).send('Error al eliminar equipo: ' + err.message);
    }
});

module.exports = router;
