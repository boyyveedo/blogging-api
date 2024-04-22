const mongoose = require('mongoose');
require('dotenv').config()
 
//connecting to database
const connectDB = (url) =>{
   return mongoose.connect(url)
}






 module.exports = connectDB 
 
 
  