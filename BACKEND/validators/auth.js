const {check}=require('express-validator');


const emailValidator=check('email')
.isEmail()
.withMessage('Must be valid email address');

const passwordValidator=check('password')
.isLength({min:6})
.withMessage('Password must be atleat 6 character long');

exports.userRegistrationValidator=[
  check('name')
  .not()
  .isEmpty()
  .withMessage('Name is required'),
  emailValidator,
  passwordValidator
  
];

exports.userSignInValidator=[
  emailValidator,
  passwordValidator
];