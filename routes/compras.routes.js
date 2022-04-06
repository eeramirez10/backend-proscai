const { getXML, getPdf, uploadXml } = require('../controllers/compras');
const { uploadFile } = require('../middlewares/uploadFile');

const app = require('express').Router();




app.get('/xml', getXML)

app.get('/pdf/:factura', getPdf)

app.post('/xml/upload',uploadFile, uploadXml)


module.exports = app;