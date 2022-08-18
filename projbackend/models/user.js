const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true
        },
        lastname: {
            type: String,
            maxlength: 32,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        userinfo: {
            type: String,
            trim: true
        },
        encry_password: {
            type: String,
            trim: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        purchases: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

//Virtuals
userSchema.virtual("password")
    .set( function(password){
        this._password = password;  //_password: underscore is used as convention for private fields
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    })

//Schema methods
userSchema.methods = {
    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },
    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try {
            return crypto
            .createHmac("sha256",this.salt)
            .update(plainpassword)
            .digest("hex")
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema);