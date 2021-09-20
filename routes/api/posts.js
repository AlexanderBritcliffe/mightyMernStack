const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth')

const Posts = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


//@route POST api/posts
//@desc Create a post
//@access Private
router.post('/', [ auth, [
  check('text', 'Text is required')
    .not()
    .isEmpty()
  ]
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route GET api/posts
//@desc Get all posts
//@access Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route GET api/posts/:id
//@desc Get post by ID
//@access Private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if(!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

//@route DELETE api/posts/:id
//@desc Delete a post
//@access Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    //check on the user
    //post.user on its own is an ObjectId which is why we need to turn to string or they would never match
    if(post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized '});
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

//@route PUT api/posts/like/:id
//@desc Like a post
//@access Private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if the post has already been liked
    //like function compares current user to the user that is logged in and turn it into string...the function
    //will only return something if there is a match so if it is greater than 0 that means the user has liked before
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    //unshift is just like push but puts it on the beginning we also want to add the user that is logged in
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route PUT api/posts/unlike/:id
//@desc Like a post
//@access Private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if the post has already been liked
    //like function compares current user to the user that is logged in and turn it into string...the function
    //will only return something if there is a match so if it is greater than 0 that means the user has liked before
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

   //get remove index
   //for each like return like.user and turn it to string then get the index of req.user.id will get correct like to remove
   const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
   //splice the correct remove index from the array
   post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/posts/comment/:id
//@desc Comment on a post
//@access Private
router.post('/comment/:id',
[
  auth,
  [
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ]
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = ({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route DELETE api/posts/comment/:id/:comment_id
//@desc Delete a comment
//@access Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    //make sure comment exists
    if(!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    //check user to make sure they are one that made comment
    if(comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    //get remove index
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    //splice the correct remove index from the array
    post.comments.splice(removeIndex, 1);

     await post.save();

     res.json(post.comments);

  } catch {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
