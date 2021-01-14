const { check } = require("express-validator");

const emailValidator = check("email")
  .isEmail()
  .withMessage("Must be a valid email address");

const passwordValidator = check("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long");

exports.userRegisterValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  emailValidator,
  passwordValidator,
  check('categories')
  .isLength({min:1})
  .withMessage('Pick atleast one category.')
];

exports.userLoginValidator = [emailValidator, passwordValidator];

exports.forgotPasswordValidator = emailValidator;

exports.resetPasswordValidator = [
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("resetPasswordLink").not().isEmpty().withMessage("Token is required."),
];
