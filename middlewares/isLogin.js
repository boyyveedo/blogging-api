const jwt = require('jsonwebtoken');
const getTokenFromHeader = require('../utils/getTokenFromHeader')

const isLogin = (req,res,next)=>{
    const token = getTokenFromHeader(req)
if(!token){
    return res.json({
        message: "No token provide, go back and login"
    })
}else jwt.verify(token, process.env.JWT_KEY, (err, decoded)=>{
    if (err){
        return res.json({
            message: "failed to authenticate token"
        })
    }else{
        req.user = decoded;
        next()
    }
})
}


module.exports = isLogin