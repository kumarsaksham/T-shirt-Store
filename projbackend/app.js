require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// My Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const paymentBTRoutes = require("./routes/paymentBT");

// Database Connection
mongoose.connect( process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then( () => {
    console.log("DATABASE CONNECTED");
})
.catch(() => {
    console.log('FAILED to connect to DATABASE');
});

//Middlewares
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors());

// My Routes
app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',orderRoutes);
app.use('/api', paymentBTRoutes);

// PORT
const port = process.env.PORT || 8000;

// Starting a Server
app.listen(port, () => {
    console.log(`Server application is running at port ${ port }`);
});