const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route GET api/profile/me (based on id in token)
//@desc get current users profile
//@access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
//ther user on line 14 pertains to profile model user field which is the object ID of user
//populate allows us to grab name and avatar properties which exists in user schema
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user '});
    }

    res.json(profile);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


//@route POST api/profile
//@desc create or update user profile
//@access Private

router.post(
  '/',
 [
   auth,
   [
     check('status', 'Status is required')
     .not()
     .isEmpty(),
     check('skills', 'Skills is required')
     .not()
     .isEmpty()
   ]
 ],
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
  }
);

module.exports = router;

//user pertains to profile model user field at top which is the object id of the user on line 13
//populate grabs array of fields we want from user model
