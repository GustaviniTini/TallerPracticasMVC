const Player = require('../models/Player');

class PlayerFactory {
    static createPlayer({ name, team }) {
        return new Player({ name, team });
    }
}

module.exports = PlayerFactory;
