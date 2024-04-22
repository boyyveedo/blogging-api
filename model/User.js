const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required: [true, 'Email is required and must be unique']

    }
,

    firstname: {
        type: String,
        required: [true, 'FirstName Is Required'],
        trim: true,
        maxlength: [20, 'name can not be more than 20 characters'],
    }
    ,
    lastname: {
        type: String,
        required: [true, 'Lastname Is Required'],
        trim: true,
        maxlength: [20, 'name can not be more than 20 characters'],
    },

    password: {
        type:String,
        required: [true, 'Password is required'],
        trim: true,
    }, 

    isAdmin:{
        type: Boolean,
        default: false
    },
    createdAt: {
    type: Date,
    default: Date.now
  }
}) 


const User = mongoose.model('User', userSchema);

module.exports = User;