const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User  = require('../../models/User');

//@route POST api/users
//@desc register User
//@access Public
router.post(
  '/',
[
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please include a password with 6 or more characters').isLength({ min: 6 })
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {  //this says if there are errors send bad request and errors above in json
    return res.status(400).json({ errors: errors.array() });
  }

  //above is validation

const { name, email, password } = req.body;  //this pulls the selected few things from body in the schema

  try {
    let user = await User.findOne({ email });

    if(user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] }); //this is to match array errors above in validation
    }

    //if the user is not found the avatar code will run bringing in the users avatar/creating one for them
    //associated with there email

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })

    user = new User({
      name,
      email,
      avatar,
      password
    });

    //this sets user variable created on line 34 to instance of new user

    const salt = await bcrypt.genSalt(10);  //we are getting a promise from bcrypt.gensalt creates hash

    user.password = await bcrypt.hash(password, salt); //this hashes the password by taking in plain text and salt bassword
    //puts the hash into user.password

    await user.save();  //saves user to database

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,  //pass in payload
      config.get('jwtSecret'), //pass in secret
      { expiresIn: 3600000 },
      (err, token) => {
        if(err) throw err;
        res.json({ token });  //send token back to client given no errors
      }
    );
  } catch(err) {
    console.log(err.message);
    res.status(500).send('Server error');
    }
  }
);
//given no errors we create new user and send json token

module.exports = router;
