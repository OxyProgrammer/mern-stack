const express=require('express');
const router=express.Router();

//import from controllers
const {requireSignIn,authMiddleware,adminMiddleware}=require('../controllers/auth');
const {read}=require('../controllers/user');


router.get('/user',requireSignIn,authMiddleware,read);

module.exports=router;