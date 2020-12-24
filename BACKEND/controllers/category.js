const Category = require('../models/category');
const slugify = require('slugify');

exports.create = (req, res) => {
  const {name,content} = req.body;
  const slug = slugify(name);
  const image={
    url:`https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
    key:'123'
  };

  const category=new Category({name,image,slug,content});

  category.postedBy=req.user._id;

  category.save((error,data)=>{
    if(error){
      console.log('CATEGORY CREATE ERROR:',error);
      return res.status(400).json({
        error:'Category creation failed'
      });
    }
    res.status(200).json({message:'Category saved successfully!'})
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