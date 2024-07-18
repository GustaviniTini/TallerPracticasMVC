const MapFactory = require('../factories/MapFactory');
const Map = require('../models/Map');

const createMap = async ({ name }) => {
    const newMap = MapFactory.createMap({ name });
    await newMap.save();
};

const getAllMaps = async () => {
    return await Map.find();
};

const updateMap = async (id, { name }) => {
    const map = await Map.findByIdAndUpdate(id, { name }, { new: true });
    if (!map) throw new Error('Mapa no encontrado');
};

const deleteMap = async (id) => {
    const map = await Map.findByIdAndDelete(id);
    if (!map) throw new Error('Mapa no encontrado');
};

module.exports = { createMap, getAllMaps, updateMap, deleteMap };
