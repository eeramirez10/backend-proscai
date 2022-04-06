const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(
    'tuvansa',
    'consultas',
    'consultas', {
    host: 'tuvansa.dyndns.org',
    dialect: 'mysql',
    logging: false
}
);

const conecction = async () => {
    try {
        await sequelize.authenticate();
        console.log('conectado correctamente');

    } catch (error) {
        console.error('Error al conectar', error);
    }
}

conecction()

module.exports = {  sequelize };

