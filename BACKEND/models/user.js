const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  username: {
    type:String,
    trim:true,
    required:true,
    max:12,
    unique:true,
    index:true,
    lowercase:true
  },
  name:{
    type:String,
    trim:true,
    required:true,
    max:32
  },
  email:{
    type:String,
    trim:true,
    required:true,
    unique:true,
    lowercase:true,
    max:32
  },
  hashed_password:{
    type:String,
    trim:true
  },
  salt:String,
  role:{
    type:String,
    default:'subscriber'
  },
  resetPasswordLink:{
    data:String,
    default:''
  }
},{timestamps:true});

//virtual fields
//methods>authenticate,encryptPassword, makeSalt
//export user model