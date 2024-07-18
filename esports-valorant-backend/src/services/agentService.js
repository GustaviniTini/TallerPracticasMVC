// src/services/agentService.js

const Agent = require('../models/Agent'); // Importar correctamente el modelo Agent

const createAgent = async ({ name, icon }) => {
    const newAgent = new Agent({ name, icon });
    await newAgent.save();
};

const getAllAgents = async () => {
    return await Agent.find();
};

const updateAgent = async (id, { name, icon }) => {
    const agent = await Agent.findByIdAndUpdate(id, { name, icon }, { new: true });
    if (!agent) throw new Error('Agente no encontrado');
};

const deleteAgent = async (id) => {
    const agent = await Agent.findByIdAndDelete(id);
    if (!agent) throw new Error('Agente no encontrado');
};

module.exports = { createAgent, getAllAgents, updateAgent, deleteAgent };
