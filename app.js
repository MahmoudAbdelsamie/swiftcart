const express = require('express');
const bodyParser = require('body-parser');


const { testDBConnection } = require('./utils/helper');

const productRoutes = require('./routes/product');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('<h1>Welcome To SwiftCart!</h1>');
});


app.use('/api/v1', productRoutes);

testDBConnection() 
    .then(() => {
        console.log('Database Connected Successfully...')
        app.listen(PORT, () => {
            console.log(`Server Running On ${PORT}`)
        })
    })
