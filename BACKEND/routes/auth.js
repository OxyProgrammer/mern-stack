const express=require('express');
const router=express.Router();

//import from controllers
const {register,registerActivate,signInUser,requireSignIn}=require('../controllers/auth');

const {userRegistrationValidator, userSignInValidator}=require('../validators/auth');
const {runValidation}=require('../validators');

router.post('/register/activate', registerActivate);
router.post('/register',userRegistrationValidator,runValidation, register);
router.post('/signin',userSignInValidator,runValidation,signInUser);

// router.get('/secret',requireSignIn,(req,res)=>{
//   res.json({
//     message:'This is secret page for logged in users only.'
//   });
// })

module.exports=router;