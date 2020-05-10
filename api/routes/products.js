const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Product = require('../models/product');

router.get('/', (req,res,next)=>{
    Product.find({}).exec().then(docs=>{
        // if(docs.length >  0){
            res.status(200).json({
                message: "handling GET request to /products",
                docs
            })
        // }else{
        //     res.status(404).json({
        //         message:'No entries found'
        //     });
        // }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});


router.post('/', (req,res,next)=>{
 
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    // exec will turn the execution code to promise
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: "Handling post request to /products",
            createdProduct: result
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
    
});

router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
                res.status(200).json(doc)
            }else{
                res.status(404).json({
                    message: "No valid entry for provided ID"
                })
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
});

router.patch('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set:updateOps}).exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:"Updated product with id "+ id,
            result
        })
        
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
})

router.delete('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id:id }).exec()
        .then(result=>{
            res.status(200).json({
                message:"Delete product with id "+ id,
                result
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        });
    
})


module.exports = router;

