const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('Conectado a MongoDB Atlas');
        })
        .catch(err => {
            console.error('Error de conexión:', err.message);
            process.exit(1);
        });
    }
}

module.exports = new Database();
