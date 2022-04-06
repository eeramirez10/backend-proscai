const { Sequelize, DataTypes } = require('sequelize');


const sequelizeTuvansa = new Sequelize('tuvansav2', 'erick', 'Ag7348pp**', {
    host: 'tuvansacloud.dyndns.org',
    dialect: 'mysql',
    timezone: 'America/Mexico_City'
});


const UserModel = require('../models/User')(sequelizeTuvansa, DataTypes);



module.exports = {
    sequelizeTuvansa,
    UserModel
}