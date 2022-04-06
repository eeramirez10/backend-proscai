const jwt = require('jsonwebtoken');

const generateJWT = ({uid}) =>
    new Promise((resolve, reject) => {

        const payload = { uid }

        jwt.sign(payload, process.env.SECRET_SEED,{ expiresIn:'2h'}, (err, token) =>{
            if(err){
                reject(new Error(err));
            }

            resolve(token);

        });


    });

module.exports ={ generateJWT };