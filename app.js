const express = require('express');
const app = express();

const ProductRoutes = require('./api/routes/products');
const OrderRoutes = require('./api/routes//orders');

app.use('/products', ProductRoutes );
app.use('/orders', OrderRoutes );
app.use((req,res, next) => {
    res.status(200).json({
        message:"It works!"
    })
});

module.exports = app;