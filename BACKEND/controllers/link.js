const Link = require('../models/link');
const slugify = require('slugify');

exports.create=(req,res)=>{
  
  const {title,url,categories,type,medium}=req.body;
  
  const slug=url;
  const link=new Link({title,slug,url,categories,type,medium});
  link.postedBy=req.user._id;
  //categories
  const arrayOfCategories = categories && categories.split(',');
  link.categories = arrayOfCategories;

  link.save((error,data)=>{
    if(error){
      console.log(error)
      return res.status(200).json({error:"Could not save link."});
    }
    return res.status(200).json(data);
  });
}

exports.list = (req, res) => {
  Link.find({}).exec((err,data)=>{
    if(err){
      return res.res.status(400).json({
        error:'Links could not load.'
      });
    }
    res.json(data);
  });
}


exports.read = (req, res) => {
}

exports.update = (req, res) => {
}

exports.remove = (req, res) => {
}