const User = require('../model/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');


const registerUser = async (req,res)=>{
try {
    const{firstname, lastname, email, password} = req.body;
    const userFound = await User.findOne({email})
    if (userFound){
       return  res.json({
            msg: "user already existed"
        });
    }
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        firstname,
        lastname, 
        email, 
        password: hashedPassword})

    res.json({
        status:"Success",
        data: "User registered",
    })
} catch (error) {
    res.json(error.message)
}
};


const loginUser = async (req,res)=>{
    
    
    try {
        const {email, password} = req.body
        const userFound = await User.findOne({email});
        const  isPasswordMatched = await bcrypt.compare(password, userFound.password) ;
        if ( !userFound || !isPasswordMatched){
            return res.status(400).json({
                msg: "Invalid Credentials"
            })
        }

        res.json({
            status: "succeed",
            data: {
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id)

            },
        })
    } catch (error) {
        res.json(error.message)
    }
};

const userProfile = async(req,res)=>{
    try {
        const {id: userID} = req.params
        const user = await User.findOne({_id: userID})
        res.json({
            status: "User profile",
            data: user
        })
    } catch (error) {
        
    }
}


 

const allUsers =  async (req, res) => {
    try {
        const users = await User.find({});
        res.status(201).json(users); 
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ error: 'Could not find users' }); 
    }
};

const createUser = async (req, res) => {
      try {
        const user = await User.create(req.body);
        res.status(201).json(user); 
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Could not create user' }); 
    }
};
  

const getSingleUser = async (req, res) => {
try {
    const {id: userID} = req. params
    const user = await User.findOne({_id: userID})

if (!user){
    return res.status(404).json({ msg: `No user with id : ${userID}` }) 
}
res.status(200).json(user);
    
} catch (error) {
    res.status(500).json({ msg: error });
}
};



const updateUser = async (req, res) => {
    try {
        const {id: userID} = req.params

const user = await User.findOneAndUpdate({_id: userID}, req.body,{
new: true,
runValidators: true,
})
if(!user){
        return res.status(404).json({ msg: `No Article with id : ${userID}` })
    }
    res.status(200).json(user)
        
    } catch (error) {
        es.status(500).json({ msg: error });
    }
};


const deleteUser = async (req, res) => {
    try {
        const {id: userID} = req. params
    const user = await User.findOne({_id: userID})

if (!user){
    return res.status(404).json({ msg: `No Article with id : ${userID}` }) 
}
res.status(200).json(user);
    } catch (error) {
       res.status(500).json({ msg: error }); 
    }
    
};

module.exports = {
    allUsers,
    createUser,
    getSingleUser,
    updateUser,
    deleteUser,
    loginUser,
    registerUser,
    userProfile,
};



