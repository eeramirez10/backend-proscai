module.exports = mapSucursalesLineChart = sucursalesDB => ([
    {
        name: 'Mexico', 
        data: sucursalesDB.filter(({ sucursal }) => sucursal === 'Mexico')
        .map(({sucursal,...data } ) => ({ name:data.mes, y:parseInt(data.venta), year: data.anio }))},
    {
        name: 'Monterrey', 
        data: sucursalesDB.filter(({ sucursal }) => sucursal === 'Monterrey')
        .map(({sucursal,...data } ) => ({ name:data.mes, y:parseInt(data.venta) }))},
    {
        name: 'Veracruz', 
        data: sucursalesDB.filter(({ sucursal }) => sucursal === 'Veracruz')
        .map(({sucursal,...data } ) => ({ name:data.mes, y:parseInt(data.venta) }))},
    {
        name: 'Mexicali', 
        data: sucursalesDB.filter(({ sucursal }) => sucursal === 'Mexicali')
        .map(({sucursal,...data } ) => ({ name:data.mes, y:parseInt(data.venta) }))},
    {
        name: 'Queretaro', 
        data: sucursalesDB.filter(({ sucursal }) => sucursal === 'Queretaro')
        .map(({sucursal,...data } ) => ({ name:data.mes, y:parseInt(data.venta) }))},
    {
        name: 'Cancun', 
        data: sucursalesDB.filter(({ sucursal }) => sucursal === 'Cancun')
        .map(({sucursal,...data } ) => ({ name:data.mes, y:parseInt(data.venta) }))},
])