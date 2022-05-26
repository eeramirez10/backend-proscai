const PromiseFtp = require('promise-ftp');

const ftp = new PromiseFtp();

const fs = require('fs');


const downloadPdf = async (fileName, path) => {

    await ftp.connect({
        host: 'tuvansa-server.dyndns.org',
        user: 'administrador',
        password: '912522Pop'
    });


    const stream = await ftp.get(`/ANEXOS/${path}/${fileName}`)

    await descarga(stream,path, fileName)

    await ftp.end()

    return true

}

const cleanPdf = (file) => {
    const path = `./uploads/${file}`;

    fs.unlinkSync(path);

}

const descarga = (stream,path, name) => (
    new Promise((resolve, reject) => {
        stream.once('close', resolve);
        stream.once('error', reject);
        stream.pipe(fs.createWriteStream(`uploads/${path}/${name}`));
    })
)

module.exports = {
    downloadPdf,
    cleanPdf
}