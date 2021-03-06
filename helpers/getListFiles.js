

const EventEmitter = require('events');

const PromiseFtp = require('promise-ftp');

const ftp = new PromiseFtp();



const getListFiles = async (items, path, fileName) => {

    EventEmitter.setMaxListeners(items.length + 3);


    try {


        if (ftp.getConnectionStatus() === 'not yet connected') {


            await ftp.connect({
                host: 'tuvansa-server.dyndns.org',
                user: 'administrador',
                password: '912522Pop'
            })

        }


        const list = await Promise.all(
            items.map(async item => {

                const [file] = await ftp.list(`/ANEXOS/${path}/${item[fileName]}.pdf`)

                return {
                    ...item,
                    pdf: file ? file.name : ''
                }
            })
        )


        return list

    } catch (error) {
        console.log(error)
    }



}

module.exports = {
    getListFiles
}