const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const product = require('../models/product');

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req,res) => {
    // creation of form object
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    // parsing the form
    form.parse(req, (err,fields,file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }

        // Destructure the fields: ( type: text in Postman ) 
        const { name,description,price,category,stock } = fields;

        // Restrictions on fields
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "Please include all fields"
            })
        }

        let product = new Product(fields);

        // Handle file here: ( type: file in Postman )
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size is too big"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // Save the product to Database
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error: "Failed to save product in Database"
                });
            }
            res.json(product);
        })
    });
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined //for performance optimization
    return res.json(req.product);
}

// Middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

// delete controller
exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product"
            });
        }
        res.json({
            message: "Product deletion successfull",
            deletedProduct
        });
    });
}

// update controller
exports.updateProduct = (req,res) => {
    // creation of form object
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    // parsing the form
    form.parse(req, (err,fields,file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }

        // updation code
        let product = req.product;
        product = _.extend(product,fields);

        // Handle file here: ( type: file in Postman )
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size is too big"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // Save the product to Database
        product.save((err,updatedProduct) => {
            if(err){
                return res.status(400).json({
                    error: "Updation of product failed"
                });
            }
            res.json(updatedProduct);
        });
    });
}

// Product listing
exports.getAllProducts = (req,res) => {
    let limit = ( req.query.limit ? parseInt(req.query.limit) : 8 );
    let sortBy =( req.query.sortBy ? parseInt(req.query.sortBy0) : "_id" );

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products) => {
        if(err){
            return res.status(400).json({
                error: "No Products Found"
            })
        }
        res.json(products);
    });
}

// Middleware
exports.updateStock = (req,res,next) => {
    let operations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { stock: -product.count ,sold: +product.count } }
            }
        }
    });

    Product.bulkWrite(operations, {}, (err,products) => {
        if(err){
            return res.status(400).json({
                error: "Bulk Operations Failed"
            })
        }
        next();
    });
}