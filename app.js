const express = require('express');
const app = express();
const cors = require('cors');
const { sequelizeTuvansa } = require('./database/configTuvansa');
require('dotenv').config();

require('./database/config');

sequelizeTuvansa.sync({alter:false, force: false})
    .then( () => console.log('Todo ok'))
    .catch( console.error )

//middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//routes
app.use('/api/compras', require('./routes/compras.routes'));
app.use('/api/charts', require('./routes/charts.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/embarques', require('./routes/embarques.routes'));

app.use('/api/files', require('./routes/files.routes'))


app.listen(process.env.PORT,() =>{
    console.log(`Server on port ${process.env.PORT}`);
})








