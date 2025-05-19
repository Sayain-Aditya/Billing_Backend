const express=require('express');
const router=express.Router();
const {createProduct,getAllProducts,deleteProduct,updateProduct,getProductbyId, searchProduct, getallProductwp}=require('../controllers/productController');
router.post('/create',createProduct);
router.get('/all',getAllProducts);
router.get('/:id',getProductbyId);
router.put('/update/:id',updateProduct);
router.get('/search',searchProduct)
router.get('/all/wp',getallProductwp)
router.delete('/delete/:id',deleteProduct);
module.exports=router;