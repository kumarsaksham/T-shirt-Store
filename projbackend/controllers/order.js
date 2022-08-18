const { Order, ProductCart } = require('../models/order')

exports.getOrderById = (req,res,next,id) => {
    Order.findById(id).exec((err,order) => {
        if(err){
            return res.status(400).json({
                error: "No Order Found in Database"
            });
        }
        req.order = order;
        next();
    })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);

    // console.log("Req Body");
    // console.log(req.body);
    // console.log("Req Profile")
    // console.log(req.profile);
    // console.log("Req Body order")
    // console.log(req.body.order);
    // console.log("Order:")
    // console.log(order);

    order.save((err, order) => {
      console.log("Inside order.save");
      console.log("error: ",err);
      console.log("order: ",order);
      if (err) {
        return res.status(400).json({
          error: "Failed to save your order in Database"
        });
      }
      res.json(order);
    });
  };

exports.getAllOrders = (req,res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error: "No Orders found in Database"
            })
        }
        res.json(order);
    });
}

exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues);
}

exports.updateStatus = (req,res) => {
    Order.updateOne(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err,order) => {
            if(err){
                return res.status(400).json({
                    error: "Can not Update Order Status"
                });
            }
            res.json(order);
        }
    );
}