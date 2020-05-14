const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type:String, required:true },
    price: { type:Number, required:true},
    productImage: { type:String, required:true},
    createdBy: mongoose.Schema.ObjectId,
    updatedBy: mongoose.Schema.ObjectId
});


module.exports = mongoose.model('Product', productSchema );