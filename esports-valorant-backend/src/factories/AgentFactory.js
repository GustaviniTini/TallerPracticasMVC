const Agent = require('../models/Agent');

class AgentFactory {
    static createAgent({ name, icon }) {
        return new Agent({ name, icon });
    }
}

module.exports = AgentFactory;
