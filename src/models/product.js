
const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
  productUnit:{
    type:String,
    required:true
  },
  productDiscount:{
    type:Number,
    required:true
  },
  productStock:{
    type:Number,
    required:true
  }

},{timestamps:true});
module.exports=mongoose.model('ProductDetails',productDetailsSchema);