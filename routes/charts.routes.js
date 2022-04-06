const { ventasSucursales, ventasVendedores } = require('../controllers/charts');


const app = require('express').Router();


app.get('/sucursales', ventasSucursales);

app.get('/vendedores', ventasVendedores )




module.exports = app;