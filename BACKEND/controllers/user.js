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
