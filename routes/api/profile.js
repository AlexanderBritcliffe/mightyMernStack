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
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;


  try {
    let profile = await Profile.findOne({ user: req.user.id })

    if(profile) { //if profile is found
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile)
    }
    //Create profile
    profile = new Profile(profileFields);

    await profile.save();
    res.json(profile);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }
  }
);

//@route GET api/profile
//@desc Get all profiles
//@access Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route GET api/profile/user/:user_id
//@desc Get profile by user id
//@access Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user',
    ['name', 'avatar']);
    //check to make sure profile for a given user
    if(!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch(err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.status(500).send('Server Error');
  }
});

//req.params.user_id is coming from the url on line 135

//@route DELETE api/profile
//@desc Delete profile user and posts
//@access Private

router.delete('/', auth, async (req, res) => {
  try {
    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove user
    await Profile.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route PUT api/profile/experience
//@desc Add profile experience
//@access Private

router.put('/experience', [ auth, [
  check('title', 'Title is required')
    .not()
    .isEmpty(),
  check('company', 'Company is required')
    .not()
    .isEmpty(),
  check('from', 'From is required')
    .not()
    .isEmpty()
  ]
],
 async (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
    }
//pulls all of the stuff below from req.body

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      //fetches profile we wantb to add experience to(finds by user by matching id which we get from token)
      profile.experience.unshift(newExp);
      //this is an array un shift is same as push but pushes onto the beginning not end
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

//user pertains to profile model user field at top which is the object id of the user on line 13
//populate grabs array of fields we want from user model
