const express = require('express');
const router = express.Router();

const {allUsers, createUser, getSingleUser, updateUser, deleteUser, registerUser, loginUser,userProfile} = require('../controller/users')
router.route('/create').post(createUser)
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile/:id').get(userProfile)
router.route('/').get(allUsers);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser)


module.exports = router