const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { errorRes, successRes } = require('../utility/utility');
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;

module.exports.userSignup_post = async (req, res) => {
  const { displayName, email, contactNumber, password } = req.body;

  if (
    !displayName.firstName ||
    !displayName.lastName ||
    !email ||
    !contactNumber ||
    !password
  )
    return errorRes(res, 400, 'All fields are required');

  try {
    const savedContactUser = await User.findOne({ contactNumber });
    if (savedContactUser) return errorRes(res, 400, 'User already exist.');
    else {
      const savedUser = await User.findOne({ email });
      if (savedUser) {
        return errorRes(res, 400, 'User already exist.');
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt
            .hash(password, salt)
            .then(hashedPassword => {
              const user = new User({
                displayName,
                email,
                contactNumber,
                password: hashedPassword,
              });
              user
                .save()
                .then(user => {
                  const {
                    _id,
                    displayName,
                    email,
                    contactNumber,
                    displayImage,
                  } = user;
                  const token = jwt.sign({ _id }, JWT_SECRET_USER);

                  res.json({
                    status: 'success',
                    data: {
                      user: {
                        _id,
                        displayName,
                        email,
                        contactNumber,
                        displayImage,
                        token,
                      },
                    },
                    message: 'User added successfully.',
                  });
                })
                .catch(err => {
                  console.log(err);
                  return errorRes(res, 500, 'Internal server error.');
                });
            })
            .catch(err => {
              console.log(err);
              return errorRes(res, 500, 'Internal server error.');
            });
        });
      }
    }
  } catch (err) {
    console.log(err);
    return errorRes(res, 500, 'Internal server error.');
  }
};

module.exports.userSignin_post = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return errorRes(res, 400, 'All fields are required.');

  User.findOne({ email })
    .then(savedUser => {
      if (!savedUser) return errorRes(res, 400, 'Invalid login credentials.');
      else {
        bcrypt
          .compare(password, savedUser.password)
          .then(doMatch => {
            if (!doMatch)
              return errorRes(res, 400, 'Invalid login credentials.');
            else {
              const { _id, displayName, contactNumber, email, displayImage } =
                savedUser;
              const token = jwt.sign({ _id }, JWT_SECRET_USER);
              return successRes(res, {
                user: {
                  _id,
                  displayName,
                  contactNumber,
                  email,
                  displayImage,
                  token,
                },
                message: 'Signin success.',
              });
            }
          })
          .catch(err => {
            console.log(err);
            return errorRes(res, 500, 'Internal server error.');
          });
      }
    })
    .catch(err => {
      console.log(err);
      return errorRes(res, 500, 'Internal server error.');
    });
};
