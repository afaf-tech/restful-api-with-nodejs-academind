const express = require('express');
const router = express.Router();


// Handling incoming Get request to /orders
router.get('/', (req,res,next)=>{
    res.status(200).json({
        message: "orders was fetched."
    });
});


router.post('/', (req,res,next)=>{
    res.status(201).json({
        message: "orders was created."
    });
});


router.get('/:orderId', (req,res,next)=>{
    res.status(200).json({
        message: "Orders details.",
        orderId: req.params.orderId
    });
});


router.delete('/:orderId', (req,res,next)=>{
    res.status(200).json({
        message: "order was deleted.",
        orderId: req.params.orderId
    });
});









module.exports = router;

