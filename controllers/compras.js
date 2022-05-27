const { QueryTypes } = require("sequelize")
const { sequelize } = require("../database/config");
const fs = require('fs');

const { getListRecepciones } = require("../helpers/getListRecepciones");

const path = require('path');
const { downloadPdf, cleanPdf } = require("../helpers/downloadPdf");


const controller = {}


const getPagination = (page = 0, size = 5) => {

    const limit = size ? Number(size) : 5;
    const offset = Number(page) * limit
    return {
        limit,
        offset
    }

}


controller.getXML = async (req, res) => {

    const { page, size, search } = req.query;

    const { limit, offset } = getPagination(page, size);

    const like = search ? 'AND DNUM  LIKE :search' : '';

    let xml = await sequelize.query(`
        SELECT 
            DFECHA fecha,
            PRVCOD codigoProveedor,
            PRVNOM proveedor,
            DMULTICIA sucursal,
            DNUM factura,
            DCANTF importe,
            PRVRFC rfc,
            DCFDIUUID uid FROM FDOC
            LEFT JOIN FPRV ON FPRV.PRVSEQ=FDOC.PRVSEQ
            WHERE MID(DNUM,1,1) IN('R','G') AND PRVRFC<>'' AND PRVTAXID='' AND DCANCELADA=0 AND (DFECHA>='2020-01-01' AND DFECHA<='2022-12-31')
            ${like}
            ORDER BY DMULTICIA,DNUM
            limit :offset, :limit
    
    `,
        {
            replacements: { offset, limit, search:`${search.toUpperCase().trim()}%` },

            type: QueryTypes.SELECT
        }
    )

    const [count] = await sequelize.query(`
        SELECT 
        COUNT(*) total
        FROM FDOC
        LEFT JOIN FPRV ON FPRV.PRVSEQ=FDOC.PRVSEQ
        WHERE MID(DNUM,1,1) IN('R','G') AND PRVRFC<>'' AND PRVTAXID='' AND DCANCELADA=0 AND (DFECHA>='2020-01-01' AND DFECHA<='2022-12-31')
        ORDER BY DMULTICIA,DNUM
        
        `, { type: QueryTypes.SELECT }
    );

   
    // if(xml.length > 0){

    //     xml = await getListRecepciones(xml)

    // }

    console.log(xml);


    res.json({
        ok: true,
        data: {
            total: count.total,
            rows: xml,
            total_page:xml.length > 0 ? Math.ceil(xml.length / limit) : 0,
            page,
            per_page: limit
        }
    })


}


controller.getPdf = async (req, res) => {

    const { factura } = req.params;

    

    if (!fs.existsSync(`./uploads/${factura}`)){ 
        await downloadPdf(factura);
    
    
    }


    res.sendFile(path.join(__dirname, `../uploads/${factura}`));

}

controller.uploadXml = ( req, res) => {

    // console.log(req.files)
    // console.log(req.file)


    res.json({
        ok: true,
        msg:'upload'
    })

}


module.exports = controller;