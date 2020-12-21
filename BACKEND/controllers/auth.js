const User=require('../models/user');
const AWS=require('aws-sdk');
const jwt=require('jsonwebtoken');
const {registerEmailParams} =require('../helpers/email');
const shortId=require('shortid');

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
      return res.status(400).json({
        error:'Email is already being used by another guy!'
      });
    };

    //generate json web token with username, email and password
    const token=jwt.sign({name,email,password},process.env.JWT_ACCOUNT_ACTIVATION,{
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

exports.registerActivate=(req,res)=>{
  const{token}=req.body;
  if(token){
  try{
    jwt.verify(token,process.env.JWT_ACCOUNT_ACTIVATION,function(error,decoded){
      if(error){
        return res.status(401).json({
          error:'Expired link. Try again.'
        });
      }

      const {name,email,password}=jwt.decode(token);
      const username=shortId.generate();

      User.findOne({email}).exec((error,user)=>{
        if(error){
          if(user){
            return res.status(401).json({
              error:'Email is taken.'
            });
          }
        }
        //Register new user.
        const newUser=new User({username,name,email,password});
        newUser.save((err,result)=>{
        if(err){
            return res.status(401).json({
              error:'Error saving user in database. Try later.'
            });
          }
          return res.json({
            message:'Registration success. Please login.'
          });
        });
      });
      });
    }catch(error){
      return res.status(401).json({
        error:'Token could not be verified. May be it expired. Please try again.'
      });
    }
    }else{
      return res.status(401).json({
        error:'Token not available.'
      });
    }
};

exports.signInUser=(req,res)=>{
  const{email,password}=req.body;
  User.findOne({email}).exec((error,user)=>{
    if(!user){
      return res.status(401).json({
        error:'Unable to locate User. Please sign up before trying to log in.'
      });
    };

  if(!user.authenticate(password)){
    return res.status(401).json({
      error:'Either email or password doesn\'t match.'
    });
  }
  const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{
    expiresIn:'7d'
  });
  const{_id,name,email,role}=user;
  return res.status(200).json({
    token,
    user:{_id,name,email,role},
    message:'User authentication successful!'
  })
  });
}