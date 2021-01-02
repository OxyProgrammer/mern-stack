const Category = require('../models/category');
const Link = require('../models/link');
const slugify = require('slugify');
const formidable=require('formidable');
const AWS=require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const s3=new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

exports.create=(req,res)=>{
  const {name,image,content} = req.body;
  const base64Data=new Buffer.from (image.replace(/^data:image\/\w+;base64,/, ''),'base64');
  const type = image.split(';')[0].split('/')[1];

  
  if(image.size>2000000){
      return res.status(400).json({
        error:"Image should be less than 2 MB"
      });
  }

  const slug = slugify(name);
  const category=new Category({name,content,slug});

    //upload image to s3
    const params={
      Bucket:'mern-stack-app-bucket',
      Key:`category/${uuidv4()}.${type}`,
      Body: base64Data,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType:`image/${type}`
    }

    //s3 upload
    s3.upload(params,(error,data)=>{
      if(error){
       
        return res.status(400).json({
          error:"Upload to s3 failed."
        });
      }
      console.log('AWS UPLOAD RES DATA ',data);
      category.image.url=data.Location;
      category.image.key=data.Key;
      category.postedBy=req.user._id;
      // save to db
      category.save((error,success)=>{
        if(error){
          console.log(error)
          return res.status(400).json({
            error:"Error saving category to database."
          });
        }
        return res.json(success);
      });
    });
}

exports.list = (req, res) => {
  Category.find({}).exec((err,data)=>{
    if(err){
      return res.res.status(400).json({
        error:'Categories could not load.'
      });
    }
    res.json(data);
  });
}


exports.read = (req, res) => {

  const {slug} = req.params;

  let limit = req.body.limitItems ? parseInt(req.body.limitItems) : 10;
  let skip = req.body.skipItems ? parseInt(req.body.skipItems) : 0;

  Category.findOne({slug})
  .populate('postedBy','_id name username')
  .exec((error,category)=>{
    if(error){
      return res.status(400).json({
        error:'Could not load category.'
      });
    }
    Link.find({categories: category})
    .populate('postedBy','_id name username')
    .populate('categories','name')
    .sort({createdAt: -1})
    .limit(limit)
    .skip(skip)
    .exec((error,links)=>{
      if(error){
        return res.status(400).json({
          error:'Could not load links.'
        });
      }
      return res.status(200).json({category,links});
    });
  });
}

exports.update = (req, res) => {
}

exports.remove = (req, res) => {
}