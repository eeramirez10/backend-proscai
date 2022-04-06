
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataT = DataTypes) =>(

    sequelize.define('user', {
        uid: {
            type: DataT.UUID,
            defaultValue: DataT.UUIDV4,
            primaryKey: true,
            
        },
        username:{
            type: DataT.STRING,
            allowNull: false,
        },
        name: {
            type: DataT.STRING,
            allowNull: false
        },
        lastname: {
            type: DataT.STRING,
            allowNull: false
        },
        email:{
            type: DataT.STRING(255),
            allowNull: false
        },
        password:{
            type: DataT.STRING,
            allowNull: false
        },
        rol:{
            type: DataT.STRING,
            allowNull: false
        }
    },{
        
    })
    
)
