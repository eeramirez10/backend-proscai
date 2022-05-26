const { UserModel } = require("../database/configTuvansa");
const bcrypt = require('bcrypt');
const { generateJWT } = require("../helpers/jwt");
const { Op } = require("sequelize");

const controller = {}

controller.register = async (req, res) => {

    const { username, email, password } = req.body;

    const salt = bcrypt.genSaltSync(8);

    try {

        let [user] = await UserModel.findAll({ where: { username } });

        if (user) {
            return res.status(200).json({
                ok: false,
                msg: 'Ya existe el nombre de usuario'
            })
        }

        [user] = await UserModel.findAll({ where: { email } });



        if (user) {
            return res.status(200).json({
                ok: false,
                msg: 'el email ya esta registrado'
            })
        }

        const userDB = await UserModel.create({
            ...req.body,
            password: bcrypt.hashSync(password, salt)
        });


        const token = await generateJWT({
            uid: userDB.uid,
            name: userDB.name,
            lastname: userDB.lastname,
            username: userDB.username,
            rol: userDB.rol
        })


        return res.json({
            ok: true,
            uid: userDB.uid,
            name: userDB.name,
            lastname: userDB.lastname,
            username: userDB.username,
            token

        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Revisar logs'
        });
    }
}

controller.login = async (req, res) => {

    const { email:emailUsername, password } = req.body;

    // console.log(req.body)
    try {

        const [user] = await UserModel.findAll({
            where: {
                [Op.or]: [
                    { userName: emailUsername },
                    { email: emailUsername }
                ]
            }
        })

        if (!user) {
            return res.status(200).json({
                ok: false,
                msg: "(Email, usuario) o password incorrectos"
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(200).json({
                ok: false,
                msg: "Email, usuario o (password) incorrectos"
            });
        }



        const token = await generateJWT({
            uid: user.uid,
            name: user.name,
            lastname: user.lastname,
            username: user.username,
            rol: user.rol
        })



        return res.json({
            ok: true,
            user: {
                uid: user.uid,
                name: user.name,
                lastname: user.lastname,
                rol:user.rol
            },
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Revisar logs'
        });

    }
}

controller.revalidarToken = async (req, res) => {

    const user = req.user;

    const token = await generateJWT({
        uid: user.uid,
        name: user.name,
        lastname: user.lastname
    });



    return res.json({
        ok: true,
        user,
        token
    })


}



module.exports = controller