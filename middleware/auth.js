const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {  //next is a callback that needs to be called so it moves on to next piece of middleware
  //get token from header
  //xuthtoken is header key we send token in
  const token = req.header('x-auth-token');

  //check if no token
  if(!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  //verify token
  //jwt.verify decodes token
  try {
      const decoded = jwt.verify(token, config.get('jwtSecret')); //verify takes in the actual token in header and the secret

      req.user = decoded.user;  //we set req.user to whatever user is inside of the token that we have decoded
      next();
    } catch(err) {
      res.status(401).json({ msg: 'Token is not valid '});
  }
}
