const Category = require('../models/category');
const slugify = require('slugify');
const formidable=require('formidable');
const AWS=require('aws-sdk');
const { v4: uuidv4 } = require('uuid');


const s3=new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

exports.create=(req,res)=>{

  let form=new formidable.IncomingForm();
  
  form.parse(req,(error,fields,files)=>{
    if(error){
      return res.status(400).json({
        error:"Image could not upload"
      });
    }
    
    const {name,content}=fields;
    const {image}=files;
    const slug = slugify(name);
    let category=new Category({name,content,slug});
    if(image.size>2000000){
      return res.status(400).json({
        error:"Image should be less than 2 MB"
      });
    }

    //upload image to s3
    const params={
      Bucket:'mern-stack-app-bucket',
      Key:`category/${uuidv4()}`,
      Body: image.path,
      ACL: 'public-read',
      ContentType:`image/jpg`
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
  });
}

exports.list = (req, res) => {
}

exports.read = (req, res) => {
}

exports.update = (req, res) => {
}

exports.remove = (req, res) => {
}