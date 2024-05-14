const express = require('express');
const { testDBConnection } = require('./utils/helper');


const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('<h1>Welcome To SwiftCart!</h1>');
});


testDBConnection() 
    .then(() => {
        console.log('Database Connected Successfully...')
        app.listen(PORT, () => {
            console.log(`Server Running On ${PORT}`)
        })
    })
