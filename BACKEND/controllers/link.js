const Link = require('../models/link');
const slugify = require('slugify');

exports.create = (req, res) => {
  const { title, url, categories, type, medium } = req.body;

  const slug = url;
  const link = new Link({ title, slug, url, categories, type, medium });
  link.postedBy = req.user._id;
  //categories
  const arrayOfCategories = categories && categories.map((c) => c._id);
  console.log(arrayOfCategories);
  link.categories = arrayOfCategories;

  link.save((error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Could not save link.' });
    }
    return res.status(200).json(data);
  });
};

exports.list = (req, res) => {
  Link.find({}).exec((err, data) => {
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
