const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  displayName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
    unique: true,
  },
  displayImage: {
    url: {
      type: String,
      default:
        'https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg',
    },
  },
  password: {
    type: String,
    required: true,
  },
  //   accountType: {
  //     type: String,
  //     required: true,
  //     default: 'employee',
  //   },
});

mongoose.model('User', UserSchema);
