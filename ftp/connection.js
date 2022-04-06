const PromiseFtp = require('promise-ftp');

const ftp = new PromiseFtp();


const isConnect = async () => {

    try {

        return await ftp.connect({
            host:'tuvansa-server.dyndns.org',
            user:'administrador',
            password:'912522Pop'
        });

        
        
    } catch (error) {
        console.log(error);

        return false;
    }


}




module.exports = {
    isConnect
}
