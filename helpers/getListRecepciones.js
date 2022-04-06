
const EventEmitter = require('events');

const PromiseFtp = require('promise-ftp');

const ftp = new PromiseFtp();



// const getListRecepciones = async (xmls) => {

//     await ftp.connect({
//         host:'tuvansa-server.dyndns.org',
//         user:'administrador',
//         password:'912522Pop'
//     })

    
//     console.log(xmls)
    

    
//     if( xmls.length === 0) return []

//     EventEmitter.setMaxListeners(xmls.length + 1)


   


//     const list = await Promise.all(
//         xmls.map(async xml => {

//             const [file] =  await ftp.list(`/ANEXOS/RECEPCIONES/${xml.factura}.pdf`)

            

//             return {
//                 ...xml,
//                 pdf: file ? file.name : ''
//             }
//         })

       

//     )



//     ftp.end()


    

//     return list


// }



const getListRecepciones = async (xmls) => {
    
    

    EventEmitter.setMaxListeners(xmls.length + 3)

    try {

        await ftp.connect({
            host:'tuvansa-server.dyndns.org',
            user:'administrador',
            password:'912522Pop'
        });
    
        const list = await Promise.all(
            xmls.map(async xml => {
    
                const [file] =  await ftp.list(`/ANEXOS/RECEPCIONES/${xml.factura}.pdf`)

                return {
                    ...xml,
                    pdf: file ? file.name : ''
                }
            })
        )
        ftp.end()
    
        return list
        
    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    getListRecepciones
}