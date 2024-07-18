const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
    createMatch,
    getAllMatches,
    getMatchById,
    updateMatch,
    deleteMatch
} = require('../services/matchService');

// Crear partido (solo admin)
router.post('/', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        const newMatch = await createMatch(req.body);
        res.status(201).json(newMatch);
    } catch (err) {
        res.status(400).send('Error al crear partido: ' + err.message);
    }
});

// Obtener todos los partidos (protegido)
router.get('/', auth, async (req, res) => {
    try {
        const matches = await getAllMatches();
        res.status(200).json(matches);
    } catch (err) {
        res.status(400).send('Error al obtener partidos: ' + err.message);
    }
});

// Obtener un partido por ID (protegido)
router.get('/:id', auth, async (req, res) => {
    try {
        const match = await getMatchById(req.params.id);
        res.status(200).json(match);
    } catch (err) {
        res.status(400).send('Error al obtener partido: ' + err.message);
    }
});

// Actualizar un partido (solo admin)
router.put('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        const updatedMatch = await updateMatch(req.params.id, req.body);
        res.status(200).json(updatedMatch);
    } catch (err) {
        res.status(400).send('Error al actualizar partido: ' + err.message);
    }
});

// Eliminar un partido (solo admin)
router.delete('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await deleteMatch(req.params.id);
        res.status(200).send('Partido eliminado');
    } catch (err) {
        res.status(400).send('Error al eliminar partido: ' + err.message);
    }
});

module.exports = router;
