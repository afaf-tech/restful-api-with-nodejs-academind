const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const checkAuth = require('../../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req,file, cb){
        cb(null, new Date().toISOString() +file.originalname);
    }
});

const fileFilter = ( req, file, cb )=>{
    // reject file
    if(file.mimetype === 'image/jpeg' || file.mimetype=== 'image/png'){
        cb(null, true);

    }else{
        cb(new Error('File must be on jpeg or png type!!'), false);
    }
}

const upload = multer(
    {
        storage:storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    });

const Product = require('../models/product');

router.get('/', (req,res,next)=>{
    Product.find({})
        .select('name price productImage createdBy')
        .exec()
        .then(docs=>{
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        createdBy: doc.createdBy,
                        request: {
                            type: 'GET',
                            url : 'http://localhost:3000/products/'+ doc._id
                        }
                    }
                })
            }
            // if(docs.length >  0){
                res.status(200).json(response)
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

// single = one file
router.post('/', checkAuth, upload.single('productImage'),  (req,res,next)=>{
    console.log(req.userData);
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
        createdBy: req.userData.userId
    })
    // exec will turn the execution code to promise
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                productImage:result.productImage,
                _id: result._id,
            }
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
        .select('name price productImage _id createdBy')
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type:'GET',
                        url:'http://localhost:300/products'
                    }
                })
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

router.patch('/:productId',checkAuth, (req,res,next)=>{
    const idUser = req.userData.userId;
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set:updateOps, updatedBy:idUser }).exec()
    .then(result=>{
        res.status(200).json({
            message:"Updated product successfully",
            request:{
                type: 'GET',
                url: 'http://localhost:3000/products/'+ id
            }
        })
        
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
})

router.delete('/:productId',checkAuth, (req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id:id }).exec()
        .then(result=>{
            res.status(200).json({
                message:"Product deleted",
                request:{
                    type: 'POST',
                    url:'http://localhost:3000/products/',
                    body: {name: 'String', price:'Number'}
                }
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

