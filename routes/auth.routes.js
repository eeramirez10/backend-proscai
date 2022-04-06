const { check } = require('express-validator');
const { register, login, revalidarToken } = require('../controllers/auth.controller');
const { validaCampos } = require('../helpers/valida-campos');

const app = require('express').Router();




app.post('/register',[
    check('username','El nombre es necesario').not().isEmpty(),
    check('name','El name es necesario').not().isEmpty(),
    check('lastname','El apellido es necesario').not().isEmpty(),
    check('email','El email es necesario').not().isEmpty(),
    check('password','El password es necesario').not().isEmpty(),
    check('rol','El rol es necesario').not().isEmpty(),
    validaCampos
], register)

app.post('/login',[
    check('email','El email es necesario').not().isEmpty(),
    check('password','El password es necesario').not().isEmpty(),
    validaCampos
], login)


app.get('/renew',revalidarToken);


module.exports = app