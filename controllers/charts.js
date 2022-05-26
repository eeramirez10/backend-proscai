

const controller = {};
const { QueryTypes } = require("sequelize")
const { sequelize } = require("../database/config");
const mapSucursalesLineChart = require("../helpers/mapSucursalesLineChart");

controller.ventasSucursales = async (req, res) => {



    let sucursalesDB = await sequelize.query(`
    SELECT 
    IF( 
        DALMACEN='01','Mexico',
        IF(DALMACEN='02','Monterrey',
        IF(DALMACEN='03','Veracruz',
        IF(DALMACEN='04','Mexicali',
        IF(DALMACEN='05','Queretaro',
        IF(DALMACEN='06','Cancun','')))))
    ) AS sucursal,
    DATE_FORMAT(DFECHA,'%M') AS mes,DATE_FORMAT(DFECHA,'%Y') AS anio,
    sum(AICANTF*AIPRECIO) AS venta,
    sum(AICANTF*AICOSTO) AS costo
    FROM FAXINV
    LEFT JOIN FDOC ON FDOC.DSEQ=FAXINV.DSEQ
    WHERE  DFECHA>=':year-01-01' AND DFECHA<=':year-12-31' AND  DESFACT=1 AND DSTATUSCFD=3 AND
                    (mid(DNUM,1,1)='F'   OR mid(DNUM,1,1)='D'  OR mid(DNUM,1,1)='C' )
    GROUP BY DALMACEN,DATE_FORMAT(DFECHA,'%m')

    `,
        {
            replacements: { year: 2022 },

            type: QueryTypes.SELECT
        }
    );

    const sucursalesMap = mapSucursalesLineChart(sucursalesDB);


    return res.json({
        ok: true,
        data: sucursalesMap
    })

}


controller.ventasVendedores = async (req,res) => {

    // console.log(req.query)

    const {sucursal} = req.query;

    const sucursales = {
        mexico:01,
        monterrey:02,
        veracruz:03,
        mexicali:04,
        queretaro:05,
        cacun:06,

    }


    let vendedoresDB = await sequelize.query(`
        SELECT  
        AGCIANAME as nombre,
        AGDESCR as descripcion, 
       
        SUM(AIPRECIO*AICANTF) AS venta_neta, 
        SUM(AIPRECIO*AICANTF)-AGPRESUP7 AS venta_iva

        FROM FAXINV
        LEFT JOIN FDOC ON FDOC.DSEQ=FAXINV.DSEQ
        LEFT JOIN FINV ON FINV.ISEQ=FAXINV.ISEQ
        LEFT JOIN FAG ON FAG.AGTNUM=FDOC.DPAR1
        LEFT JOIN FCLI ON FCLI.CLISEQ=FAXINV.CLISEQ
        WHERE  
        DFECHA>='2022-03-01' AND 
        DFECHA<='2022-03-31' AND 
        DESFACT=1 AND  
        DMULTICIA = :sucursal AND 
        DSTATUSCFD = 3  AND 
        ( mid(DNUM,1,2) <> 'AF' AND 
        mid(DNUM,1,2) <> 'AN' AND mid(DNUM,1,2)<>'CT') 
        
        GROUP BY AGDESCR ORDER BY venta_neta desc
    `, {
       
        replacements: { sucursal : sucursales[sucursal] ? sucursales[sucursal] : 01  },
        type: QueryTypes.SELECT
    })

    const drillDown = vendedoresDB.map( vendedor =>({
        name: vendedor.descripcion,
        id: vendedor.descripcion,
        data: [ { name: vendedor.nombre, y:parseInt(vendedor.venta_neta)} ]
    }))

    return res.json({
        ok: true,
        data: drillDown
    })

}



module.exports = controller;