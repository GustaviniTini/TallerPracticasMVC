const Map = require('../models/Map');

class MapFactory {
    static createMap({ name }) {
        return new Map({ name });
    }
}

module.exports = MapFactory;
