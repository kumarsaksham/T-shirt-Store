const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req,res) => {

    // console.log("REQ BODY", req.body);
    // res.json({
    //     message: "Signup route works"
    // });

    // Validation
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    // Saving user to DB.
    const user = new User(req.body);
    user.save((err,user) =>{
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
}

exports.signin = (req,res) => { 
    const { email, password } = req.body;

    // Validation Result
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    // Authentication
    User.findOne({ email }, (err,user) =>{
        // handle error
        if(err){
            return err;
        }

        // email/user not found in DB
        if(!user){
            return res.status(400).json({
                error: "User email does not exist."
            });
        }

        // email found but incorrect password.
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and Password do not match."
            });
        }

        // If user (email and password) is authenticated.
        // create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET);
        
        // put token in cookies
        res.cookie("token",token, {expire: new Date() + 9999});

        // send response to frontend
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });

    });
}

exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message: "User sigout successfull"
    });
}

// Protected Routes (Middleware using expressJwt  => no next() )
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

// Custom Middleware
exports.isAuthenticated = (req,res,next) => {
    let checker = ( req.profile && req.auth && (req.profile._id == req.auth._id) );
    
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED as Authentication Failed"
        });
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not an Admin, Access Denied!"
        });
    }
    next();
}