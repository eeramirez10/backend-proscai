
const path = require('path')

const multer = require('multer')
const FTPStorage = require('multer-ftp');

const upload = multer({
    fileFilter: (req, file, cb) =>
        (file.mimetype !== 'application/pdf')
            ? cb('Archivo no permitido')
            : cb(null, true)
    ,

    storage: new FTPStorage({

        basepath: '/ANEXOS/RECEPCIONES',
        destination: (req, file, options, cb) => cb(null, path.join(options.basepath, file.originalname))
        ,

        ftp: {
            host: 'tuvansa-server.dyndns.org',
            secure: false,
            user: 'Administrador',
            password: '912522Pop'
        }
    }),
}).array('pdf')


const uploadFile = (req,res,next) =>{

    upload(req,res, function(err){

        if (err){

            console.log(err)
            return res.status(200).json({
                ok:false,
                msg:err
            })
        }
 
        next();
     })

}

module.exports = {
    uploadFile
}