const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

//@route GET api/auth
//@desc Returns user information given has token
//@access Public
router.get('/', auth, async (req, res) => {  //auth as argument protects this route
  try {
    const user = await User.findById(req.user.id).select('-password'); //this finds the id within the token since this is a protected route that uses token
    res.json(user)  //sends along the user
  } catch(err) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
});

//in our middleware we set req.user to user token

//@route POST api/auth
//@desc autheticate user and get token (login)
//@access Public
router.post(
  '/',
[
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }); //check for the user

    if(!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] }); //check if NOT a user
    }

    const isMatch = await bcrypt.compare(password, user.password); //compares plain text and encrypted password
    //if there is a user as checked for above user.password will be accessable through user because we made request
    //to database to get the user

    if(!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const payload = {
      user: {
        id: user.id //setting the id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600000 },
      (err, token) => {
        if(err) throw err;
        res.json({ token });
      }
    );
  } catch(err) {
    console.log(err.message);
    res.status(500).send('Server error');
    }
  }
);

//this sends a post request to api/auth if credentials invalid client gets error if not returns token

module.exports = router;

//since this is protected route and we use token which has id and in middleware we set req.user to the user and the token we can pass
//in req.user and find id
