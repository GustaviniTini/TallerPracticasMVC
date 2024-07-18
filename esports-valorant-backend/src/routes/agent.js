// src/routes/agent.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createAgent, getAllAgents, updateAgent, deleteAgent } = require('../services/agentService');

// Crear agente (solo admin)
router.post('/', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await createAgent(req.body);
        res.status(201).send('Agente creado');
    } catch (err) {
        res.status(400).send('Error al crear agente: ' + err.message);
    }
});

// Obtener todos los agentes
router.get('/', auth, async (req, res) => {
    try {
        const agents = await getAllAgents();
        res.status(200).json(agents);
    } catch (err) {
        res.status(400).send('Error al obtener agentes: ' + err.message);
    }
});

// Actualizar un agente (solo admin)
router.put('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await updateAgent(req.params.id, req.body);
        res.status(200).send('Agente actualizado');
    } catch (err) {
        res.status(400).send('Error al actualizar agente: ' + err.message);
    }
});

// Eliminar un agente (solo admin)
router.delete('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        await deleteAgent(req.params.id);
        res.status(200).send('Agente eliminado');
    } catch (err) {
        res.status(400).send('Error al eliminar agente: ' + err.message);
    }
});

module.exports = router;
