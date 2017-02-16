var express = require('express');
var router = express.Router();
var passport = require('passport');
var uuidV4 = require('uuid/v4');

// TODO: Use a mail sending agent.

var User = require('../models/user.js');
var tempUser = require('../models/tempUser.js');

function createTempUser(webmail, token) {
    var tempuser = new tempUser({
        username: webmail,
        token: token
    });
    tempuser.save();
}

function sendVerificationMail(webmail, token) {

  var verificationURL = 'http://localhost:4000/verify/' + token;
  console.log(verificationURL);
}

router.post('/register', function(req, res) {

  var userDetails = {
    username: req.body.username,
    name: {
      firstname: req.body.firstname,
      lastname: req.body.lastname
    },
    gender: req.body.gender,
    verified: false
  }

  User.register(new User(userDetails),
    req.body.password,
    function(err, account) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          err: err
        });
      }

      var token = uuidV4().replace(/-/g, '');
      createTempUser(userDetails.username, token);
      sendVerificationMail(userDetails.username, token);

      return res.status(200).json({
        status: 'Verification mail sent.'
      });

    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        err: info
      });
    }

    if(!user.verified) {
      return res.status(400).json({
        verified: user.verified
      });
    }

    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user.'
        });
      }
      res.status(200).json({
        status: 'Login successful!',
        verified: user.verified
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  var status = false;
  if(req.isAuthenticated())
    status = true; 

  res.status(200).json({
    status: status
  });
});

module.exports = router;