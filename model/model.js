const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type  : String
        },
        email : {
            type : String,
            required : true
        },
        phone : {
            type : String,
            required : true
        },
        address : {
            addressLine : String,
            city : String,
            state : String,
            zip : String,
        },
        password: {
            type : String,
            required : true
        },
        IsDeleted : {
            type : Boolean,
            default : false
        }
    },{versionKey: false,
   })
    
    

module.exports = mongoose.model("users", usersSchema);