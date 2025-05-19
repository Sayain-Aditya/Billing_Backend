const mongoose=require('mongoose');

const Product=require('../models/product');

exports.createProduct=async(req,res)=>{
    const {productName,productPrice,productUnit,productDiscount,productStock}=req.body;
try {
    if(!productName || !productPrice || !productUnit || !productDiscount || !productStock){
        return res.status(400).json({message:'Please fill all the fields'});
    }
    const product= new Product({
        productName:productName,
        productPrice:productPrice,
        productUnit:productUnit,
        productDiscount:productDiscount,
        productStock:productStock

    });
    await product.save();
    res.status(201).json({
        message:'Product created successfully',
        success:true,
        data:product
    })
} catch (error) {
    res.status(500).json({
        message:'Internal server error',
        success:false,
        error:error.message
    })
}
}
exports.getAllProducts = async (req, res) => {
    try {
        // Get page & limit from query params, set defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many documents to skip
        const skip = (page - 1) * limit;

        // Fetch paginated products
        const products = await Product.find().skip(skip).limit(limit);

        // Get total count for pagination info
        const total = await Product.countDocuments();

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: 'No products found',
                success: false
            });
        }

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: error.message
        });
    }
};
// without pagination
exports.getallProductwp = async (req, res) => {
    try {
        const products = await Product.find();

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: 'No product found',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Products fetched successfully',
            success: true,
            data: products
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: error.message
        });
    }
};

exports.deleteProduct=async(req,res)=>{
    
    try{
        const product=await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                message:"Product not Found"
            })
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message:"Product deleted successfully",
            success:true
        })
    }
    catch(error){
console.log('Error while deleting product',error);
res.status(500).json({
    message: 'Internal server error',
    success: false,
    error: error.message
})
    }
}
exports.getProductbyId=async(req,res)=>{
try {
    const product=await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            message:"Product not Found"
        })
    }
    res.status(200).json({
        message:"Product fetched successfully",
        success:true,
        data:product
    })
} catch (error) {
    
}
}
exports.updateProduct=async(req,res)=>{
    try{
    const {productName,productPrice,productUnit,productDiscount,productStock}=req.body;
    const productId=req.params.id;
    if(!productId){
        return res.status(400).json({
            message:"Product ID is required"
        })
    }
    const existingProduct=await Product.findById(productId);
    if(!existingProduct){
        return res.status(404).json({
            message:"Product not found"
        })

    }
    existingProduct.productName=productName || existingProduct.productName;
    existingProduct.productPrice=productPrice || existingProduct.productPrice;
    existingProduct.productUnit=productUnit || existingProduct.productUnit;
    existingProduct.productDiscount=productDiscount || existingProduct.productDiscount;
    existingProduct.productStock=productStock || existingProduct.productStock;
    await existingProduct.save();
    res.status(200).json({
        message:"Product updated successfully",
        success:true,
        data:existingProduct
    })
    }
    catch(error){
        res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }

}
exports.searchProduct = async (req, res) => {
    try {
        const search = req.query.q;


        if (!search) {
            return res.status(400).json({
                message: "Query is required",
                success: false
            });
        }

        const product = await Product.find({
            $or: [
                { productName: { $regex: search, $options: 'i' } },
              
           
            ]
        });

        if (!product || product.length === 0) {
            return res.status(404).json({
                message: "No product found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            data: product
        });
    } catch (error) {
      return  res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};
