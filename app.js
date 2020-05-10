const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ProductRoutes = require('./api/routes/products');
const OrderRoutes = require('./api/routes//orders');


mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`,{ useNewUrlParser: true , useUnifiedTopology:true})
    .then(()=>{
        console.log('db connected and server has been stated.');
        
        
        app.listen(8000);
    })
    .catch((err)=>{
        console.log(err);
    })
mongoose.Promise = global.Promise;  

// Middleware for logging
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
// json usually for api 
app.use(bodyParser.json());

// Controlling CORS
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*"); /// * (for all client) or www.certainclient.com
    res.header("Access-Control-Allow-Headers"
    ,"Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header("Accept-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
})

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