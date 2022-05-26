
const path = require('path')

const multer = require('multer')
const FTPStorage = require('multer-ftp');

const upload = multer({
    fileFilter: (req, file, cb) =>{

        // console.log(file)

       return  (file.mimetype !== 'application/pdf')
        ? cb('Archivo no permitido')
        : cb(null, true)
    }
  
    ,

    storage: new FTPStorage({

        basepath: '/ANEXOS',
        destination: (req, file, options, cb) => {

            // console.log(`${options.basepath}/${req.params.path}`)

           return cb(null, path.join(`${options.basepath}/${req.params.path}` , `${req.params.name}.pdf`))

        }
       
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