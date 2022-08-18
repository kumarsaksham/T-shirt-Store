const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// ProductCartSchema
const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    price: Number,
    count: Number
});
const ProductCart = mongoose.model('ProductCart',ProductCartSchema);


// cart or orderSchema
const orderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
        type: String,
        default: "Received",
        enum: ["Received", "Processing", "Shipped", "Delivered", "Cancelled"]
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
},
{ timestamps: true }
);
const Order = mongoose.model('Order',orderSchema);


module.exports = { Order, ProductCart }