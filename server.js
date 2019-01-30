'use strict';

const app = require('./app');
const port = process.env.PORT || 8000;

app.listen(port, () =>{
    console.log(`El servidor esta corriendo en el puerto: ${port}`)
});
