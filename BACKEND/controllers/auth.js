const User=require('../models/user');
const AWS=require('aws-sdk');
const jwt=require('jsonwebtoken');
const {registerEmailParams} =require('../helpers/email');

AWS.config.update({
  accessKeyId:process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  region:process.env.AWS_REGION
});

const ses=new AWS.SES({apiVersion:'2010-12-01'});


exports.register = (req, res) => {

  const{name,email,password}=req.body;
  //check if user exists in db
  User.findOne({email}).exec((err,user)=>{
    if(user){
      console.log(err);
      return res.status(400).json({
        error:'Email is already being used by another guy!'
      });
    };

    //generate json web token with username, email and password
    let token=jwt.sign({name,email,password},process.env.JWT_ACCOUNT_ACTIVATION,{
      expiresIn:'30m'
    });

    const params=registerEmailParams(email,token);

    const sendEmailOnregister=ses.sendEmail(params).promise();

    sendEmailOnregister
    .then(data=>{
      console.log('email submitted to ses!',data);
      res.json({
        message:`Email has been sent to ${email}, follow the instuctions on complete your registration.`
      });
    })
    .catch(error=>{
      console.log(error);
      res.status(400).json({
        error:`We could not verify your email. Please try again.`
      })
    });
    });

 

  
};









