const { embarques, upload, getPdf } = require('../controllers/embarques.controller');
const { uploadFile } = require('../middlewares/uploadFile');

const app = require('express').Router();


app.get('/', embarques);

app.post('/file/upload/:path/:name',uploadFile,upload);


app.get('/pdf/:pdf', getPdf)


module.exports = app;