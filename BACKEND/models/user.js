const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 12,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
      max: 32,
    },
    hashed_password: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: String,
      default: 'subscriber',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
  },
  { timestamps: true }
);

//virtual fields
userSchema
  .virtual('password')
  .set(function (password) {
    //create temp variable called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    //encrypt password
    this.hashed_password = this.encryptPassword(password, salt);
  })
  .get(function (password) {
    this._password = password;
  });

//methods>authenticate,encryptPassword, makeSalt
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) == this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      crypto.createHmac('sha1', secret).update(password).digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
};

//export user model
module.exports = mongoose.model('User', userSchema);
