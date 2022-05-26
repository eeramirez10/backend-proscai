const { pdf } = require('../controllers/files.controller');
const { check } = require('express-validator');
const { validaCampos } = require('../helpers/valida-campos');

const app = require('express').Router();


app.get('/:type/:fileName',[
    check('type', 'El nombre del hospital es necesario').not().isEmpty(),
    validaCampos

],pdf)


module.exports = app;