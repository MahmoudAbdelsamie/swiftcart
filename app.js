const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan')
const rateLimit = require('express-rate-limit');

const { testDBConnection } = require('./utils/helper');
const swaggerSetup = require('./swagger')

const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');
const shippingRoutes = require('./routes/shipping');
const reviewRoutes = require('./routes/review');
const wishlistRoutes = require('./routes/wishlist');



const {errorHandler} = require('./middlewares/errorHandler');



const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
  });
app.use(limiter);
  

app.use(helmet());
app.use(morgan('combined'));


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
app.use('/api/v1', reviewRoutes);
app.use('/api/v1', wishlistRoutes);

swaggerSetup(app);


app.use(errorHandler);

testDBConnection() 
    .then(() => {
        console.log('Database Connected Successfully...')
        app.listen(PORT, () => {
            console.log(`Server Running On http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.err(err);
    })
