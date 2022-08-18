const express = require('express');
const router = express.Router();


const { getProductById, createProduct, getProduct, photo,
        updateProduct, deleteProduct, getAllProducts } = require('../controllers/product');
const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');

// param
router.param("userId", getUserById);
router.param("productId", getProductById);

// actual routes goes here
// Create route
router.post("/product/create/:userId", isSignedIn,isAuthenticated,isAdmin, createProduct);

// Read route
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

// Update route
router.put("/product/:productId/:userId", isSignedIn,isAuthenticated,isAdmin, updateProduct);

// Delete route
router.delete("/product/:productId/:userId", isSignedIn,isAuthenticated,isAdmin, deleteProduct);

// listing route
router.get("/products", getAllProducts);

// router.get("/products/categories", getAllUniqueCategories);

module.exports = router;