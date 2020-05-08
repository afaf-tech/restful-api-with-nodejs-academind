const express = require('express');
const app = express();
const morgan = require('morgan');


const ProductRoutes = require('./api/routes/products');
const OrderRoutes = require('./api/routes//orders');

// Middleware for logging
app.use(morgan('dev'));

// Routes which should handle requests
app.use('/products', ProductRoutes );
app.use('/orders', OrderRoutes );

//Middleware for error handling
app.use((req,res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        err:{
            message: error.message
        }
    });
});

module.exports = app;