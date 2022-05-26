const { downloadPdf } = require('../helpers/downloadPdf');
const { existsSync } = require('fs');

const { join } = require('path')





const types = {
    gastos: 'RECEPCIONES',
    embarques: "EMBARQUES"
}



const pdf = async (req, res) => {

    const { fileName, type } = req.params;

    // console.log(fileName,type)

    if (!existsSync(`./uploads/${fileName}`)) {
        await downloadPdf(fileName, types[type]);


    }

    res.sendFile(join(__dirname, `../uploads/${types[type]}/${fileName}`));



}


module.exports = {
    pdf
}
