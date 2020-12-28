const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
  {
    title:{
      type:String,
      trim:true,
      required:true,
      max:256
    },
    url:{
      type:String,
      trim:true,
      required:true,
      max:256
    },
    slug:{
      type:String,
      lowercase:true,
      unique:true,
      required:true,
      index:true
    },
    postedBy:{
      type:mongoose.Schema.ObjectId,
      ref:'User'
    },
    categories:[{
      type:mongoose.Schema.ObjectId,
      ref:'Category',
      required:true,
    }],
    type:{
      type:String,
      default: 'Free'
    },
    meduim:{
      type:String,
      default: 'Video'
    },
    clicks:{
      type:Number,
      default:0
    }
  },{timestamps:true});

  module.exports = mongoose.model('Link', linkSchema);