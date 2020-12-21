const express=require('express');
const router=express.Router();

//import from controllers
const {register,registerActivate}=require('../controllers/auth');

const {userRegistrationValidator}=require('../validators/auth');
const {runValidation}=require('../validators');

router.post('/register',userRegistrationValidator,runValidation, register);
router.post('/register/activate', registerActivate);

module.exports=router;