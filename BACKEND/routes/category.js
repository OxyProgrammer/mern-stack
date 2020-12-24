const express = require("express");
const router = express.Router();


// import validators
const {  categoryCreateValidator,  categoryUpdateValidator} = require("../validators/category");
const { runValidation } = require("../validators");

// import from controllers
const { requireSignin, authMiddleware, adminMiddleware } = require('../controllers/auth');
const{create,list,update,read,remove}=require('../controllers/category');

//routes
router.post('/category',categoryCreateValidator,runValidation,requireSignin,adminMiddleware,create);
router.get('/categories',list);
router.get('/category/:slug',read);
router.put('/category/:slug',categoryUpdateValidator,runValidation,requireSignin,adminMiddleware,update);
router.delete('/category/:slug',requireSignin,adminMiddleware,remove);

module.exports=router;
