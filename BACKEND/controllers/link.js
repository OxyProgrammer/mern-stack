const slugify = require('slugify');
const AWS = require('aws-sdk');
const Link = require('../models/link');
const User = require('../models/user');
const Category = require('../models/category');
const {linkPublishedParams} = require('../helpers/email');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.create = async (req, res) => {
  const { title, url, categories, type, medium } = req.body;

  const slug = url;
  const link = new Link({ title, slug, url, categories, type, medium });
  link.postedBy = req.user._id;
  //categories
  const arrayOfCategories = categories && categories.map((c) => c._id);
  link.categories = arrayOfCategories;

  try {
    const data = await link.save();
    res.status(200).json(data);
    //find all users in the category nd send mass email
    User.find({ categories: { $in: categories } }).exec((error, users) => {
      if (error) {
        console.log('Error finding users to send email on link publish');
        throw new Error(err);
      }
      Category.find({ _id: { $in: categories } }).exec((error, result) => {
        data.categories = result;
        for (let i = 0; i < users.length; i++) {
          const params = linkPublishedParams(users[i].email, data);
          const sendEmail = ses.sendEmail(params).promise();

          sendEmail
            .then((success) => {
              console.log('Email submitted to SES.', success);
              return;
            })
            .catch((error) => {
              console.log('error on Email submitted to SES.', error);
              return;
            });
        }
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Could not save link.' });
  }
};

exports.list = (req, res) => {
  let limit = req.body.limitItems ? parseInt(req.body.limitItems) : 10;
  let skip = req.body.skipItems ? parseInt(req.body.skipItems) : 0;

  Link.find({})
    .populate('postedBy', 'name')
    .populate('categories', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.res.status(400).json({
          error: 'Links could not load.',
        });
      }
      res.json(data);
    });
};

exports.read = (req, res) => {
  const { id } = req.params;
  Link.findOne({ _id: id }).exec((error, data) => {
    if (error) {
      return res.status(400).json({
        error: 'Error finding link.',
      });
    }
    return res.status(200).json(data);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { title, url, categories, type, medium } = req.body;
  const updatedLink = { title, url, categories, type, medium };
  Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec(
    (error, updated) => {
      if (error) {
        return res.status(400).json({
          error: 'Error updating link.',
        });
      }
      res.json(updated);
    }
  );
};

exports.remove = (req, res) => {
  const { id } = req.params;
  Link.findOneAndRemove({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Error removing link.',
      });
    }
    return res.status(200).json({ message: 'Link removed successfully.' });
  });
};

exports.clickCount = (req, res) => {
  const { linkId } = req.body;
  console.log(linkId);
  Link.findByIdAndUpdate(
    linkId,
    { $inc: { clicks: 1 } },
    { upsert: true, new: true }
  ).exec((error, result) => {
    if (error) {
      return res.status(400).json({
        error: 'Could not update view count',
      });
    }
    return res.status(200).json(result);
  });
};
