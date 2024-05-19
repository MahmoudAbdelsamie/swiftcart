const express = require('express');
const bodyParser = require('body-parser');


const { testDBConnection } = require('./utils/helper');

const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');
const shippingRoutes = require('./routes/shipping');





const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('<h1>Welcome To SwiftCart!</h1>');
});


app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', cartRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', shippingRoutes);




testDBConnection() 
    .then(() => {
        console.log('Database Connected Successfully...')
        app.listen(PORT, () => {
            console.log(`Server Running On ${PORT}`)
        })
    })
    .catch(err => {
        console.err(err);
    })
