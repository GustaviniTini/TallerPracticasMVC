const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createMap, getAllMaps, updateMap, deleteMap } = require('../services/mapService');

// Crear mapa (solo admin)
router.post('/', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await createMap(req.body);
        res.status(201).send('Mapa creado');
    } catch (err) {
        res.status(400).send('Error al crear mapa: ' + err.message);
    }
});

// Obtener todos los mapas (protegido)
router.get('/', auth, async (req, res) => {
    try {
        const maps = await getAllMaps();
        res.status(200).json(maps);
    } catch (err) {
        res.status(400).send('Error al obtener mapas: ' + err.message);
    }
});

// Actualizar un mapa (solo admin)
router.put('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await updateMap(req.params.id, req.body);
        res.status(200).send('Mapa actualizado');
    } catch (err) {
        res.status(400).send('Error al actualizar mapa: ' + err.message);
    }
});

// Eliminar un mapa (solo admin)
router.delete('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await deleteMap(req.params.id);
        res.status(200).send('Mapa eliminado');
    } catch (err) {
        res.status(400).send('Error al eliminar mapa: ' + err.message);
    }
});

module.exports = router;
