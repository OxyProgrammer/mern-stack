const Link = require('../models/link');
const User = require('../models/user');

exports.read = (req, res) => {
  User.findOne({ _id: req.user._id }).exec((error, user) => {
    if (error) {
      return res.status(400).json({ error: 'User not found.' });
    }
    Link.find({ postedBy: user })
      .populate('categories', 'name slug')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .exec((error, links) => {
        if (error) {
          return res.status(400).json({ error: 'Could not find links' });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json({ user, links });
      });
  });
};

exports.update = (req, res) => {
  const { name, password } = req.body;
  let categories=[];
  if(req.body.categories){
    categories=req.body.categories.map(c=>c._id);
  }
  switch (true) {
    case password && password.length < 6:
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 character long.' });
  }
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, password, categories },
    { new: true }
  ).exec((error, updatedUser) => {
    if (error) {
      return res.status(400).json({ error: 'Could not find user to update.' });
    }
    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;
    res.status(200).json(updatedUser);
  });
};
