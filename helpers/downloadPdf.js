

var fs = require('fs');

const PromiseFtp = require('promise-ftp');

const ftp = new PromiseFtp();




const downloadPdf = async (factura) => {
    console.log(factura)



    if (fs.existsSync(`./uploads/${factura}`)) return;


    await ftp.connect({
        host: 'tuvansa-server.dyndns.org',
        user: 'administrador',
        password: '912522Pop'
    });

    


    const stream = await ftp.get(`/ANEXOS/RECEPCIONES/${factura}`)

    await descarga(stream, factura);

    await ftp.end()


}

const cleanPdf = (file) => {
    const path = `./uploads/${file}`;

    fs.unlinkSync(path);

}

const descarga = (stream, name) =>
    new Promise((resolve, reject) => {
        stream.once('close', resolve);
        stream.once('error', reject);
        stream.pipe(fs.createWriteStream(`uploads/${name}`));
    })

module.exports = {
    downloadPdf,
    cleanPdf
}