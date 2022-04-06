const jwt = require('jsonwebtoken');

const validJWT = (req, res, next) => {

    const token = req.header('x-token');

    try {

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la peticion'
            });
        }

        const { iat, exp, ...user } = jwt.verify(token, process.env.SECRET_SEED);

        //aqui se guarda el usuario que inicia sesion
        req.user = user;

        console.log(req.user);
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            message: error,
        });
    }
}


module.exports = {
    validJWT
}