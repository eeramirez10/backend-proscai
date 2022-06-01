
const { QueryTypes } = require("sequelize")
const { sequelize } = require("../database/config");
const { downloadPdf } = require("../helpers/downloadPdf");
const { getListFiles } = require("../helpers/getListFiles");

const fs = require('fs')

const path = require('path')



const getPagination = (page = 0, size = 5) => {

    const limit = size ? Number(size) : 5;
    const offset = Number(page) * limit
    return {
        limit,
        offset
    }

}

const embarques = async (req, res) => {


    const { page, size, search } = req.query;

    const { limit, offset } = getPagination(page, size);

    const like = search ? 'AND DRUTA  LIKE :search' : '';


    let embarques = await sequelize.query(`
        SELECT 
        DNUM factura,
        DTALON remision,
        CAST(mid(DRUTA,1,POSITION("." IN DRUTA)-1) AS CHAR)  ruta,
        DRUTA druta,
        DFECHA fecha,
        CLICOD codigoCliente,
        CLINOM nombreCliente,
        AGDESCR agente,
        SUM(DCOSTOFLETE) AS costo ,
        DFOLIO estado,
        DATE_FORMAT(DFECHAFOLIO,"%Y-%m-%d") fechaFolio,
        DREFERELLOS referencia
        FROM FDOC
        LEFT JOIN FCLI ON FCLI.CLISEQ=FDOC.CLISEQ
        LEFT JOIN FAG AS AG1 ON AG1.AGTNUM=FDOC.DPAR1
        WHERE DESFACT=1 AND mid(DNUM,1,1)='F' AND DMULTICIA='01' AND DFECHA>='2022-01-01' 
        
        GROUP BY RUTA
        ${like}
        ORDER BY DFECHA DESC ,DRUTA,DNUM
        limit :offset, :limit
    
    `,
        {
            replacements: { offset, limit, search: `%${search}%` },
            type: QueryTypes.SELECT
        }
    );

    const [count] = await sequelize.query(`
        SELECT 
        COUNT(*) total
        FROM FDOC
        LEFT JOIN FCLI ON FCLI.CLISEQ=FDOC.CLISEQ
        LEFT JOIN FAG AS AG1 ON AG1.AGTNUM=FDOC.DPAR1
        WHERE DESFACT=1 AND mid(DNUM,1,1)='F' AND DMULTICIA='01' AND DFECHA>='2022-01-01'
        
        
    `,

        {

            type: QueryTypes.SELECT
        }
    );


    embarques = await Promise.all(

        embarques.map( async (embarque) =>({ ...embarque, detalle: await getDetalleRutas(embarque.ruta)}) )
    )

    embarques = await getListFiles(embarques,'EMBARQUES','ruta');

    // console.log(embarques)

    res.json({
        ok: true,
        data: {
            total: count.total,
            rows: embarques,
            total_page: embarques.length > 0 ? Math.ceil(embarques.length / limit) : 0,
            page,
            per_page: limit
        }

    })

}


const getDetalleRutas = async (ruta) => {

    if( ruta === '0') return [];

    const rutas = await sequelize.query(`

        Select
        DNUM factura,
         DTALON remision,
        CAST(mid(DRUTA,1,POSITION("." IN DRUTA)-1) AS CHAR)  ruta,
        DRUTA druta,
        DCOSTOFLETE AS costo ,
        DFOLIO estado,
        DREFERELLOS referencia
        FROM FDOC
        LEFT JOIN FCLI ON FCLI.CLISEQ=FDOC.CLISEQ
        LEFT JOIN FAG AS AG1 ON AG1.AGTNUM=FDOC.DPAR1
        WHERE DESFACT=1 AND mid(DNUM,1,1)='F' AND DMULTICIA='01' AND (DFECHA>='2022-01-01' AND DFECHA<='2022-02-28')
        AND CAST(mid(DRUTA,1,POSITION("." IN DRUTA)-1) AS CHAR) = :ruta
        ORDER BY DRUTA;
    
    `, {
        replacements: { ruta },
        type: QueryTypes.SELECT

        }
    );


    return rutas

}


const getPdf = async ( req, res) => {

    const { pdf } = req.params;

    // console.log(pdf)

    if (!fs.existsSync(`./uploads/${pdf}`)){ 
        await downloadPdf(pdf,'EMBARQUES');
    
    
    }


    res.sendFile(path.join(__dirname, `../uploads/EMBARQUES/${pdf}`));

}


const upload = (req,res) => {



    res.json({
        ok:true,
        msg:'Subido correctamente'
    })

}



module.exports = {
    embarques,
    upload,
    getPdf
}