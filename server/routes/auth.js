var express = require('express');
var router = express.Router();
var passport = require('passport');

var verify = require('./verify.js');
var User = require('../models/user.js');

// post request to /auth/login
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
  
    if (!user) { // user not registered already, then sign him up

      var userDetails = {
        username: req.body.username,
        password: req.body.password,
        mailServer: req.body.mailServer
      };

      // connect to corresponding mail server and login the user
      verify.verifyUser(userDetails, function(status) {
        
        if(status) {
          
          var userDetails = {
            username: req.body.username,
          };

         User.register(new User(userDetails), req.body.password, 
          function(err, account) {
             if (err) {
                console.log(err);
                return res.status(500).json({
                  err: err
                });
              }
      
                req.logIn(account, function(err) {
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

          });

        } else { // if user doesn't exist OR user not verified by the mail servers
          return res.status(401).json({
            err:info
          });
        }
      });

    } else {// user has already registered, so simple log in 

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
    }
  })(req, res, next);
});

router.get('/initial', function(req, res) {
  User.findById(req.user._id, function(err, user) {
    if(err || !user){
      res.status(500).json({
        status:'User not verified!'
      });
    }
  
    user.verified = true;
    user.save(function() {
      res.status(200).json({
      });
    });

  });
});

router.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy(function() {
    res.clearCookie('nexus.sid', {path:'/'});
    res.clearCookie('io', {path:'/'});
    return res.status(200).json({
      status: 'Bye!'
    });
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

// setting the details of the user
router.post('/new', function(req,res) {
  User.findById(req.user._id, function(err, user) {
    if(err || !user) {
      res.status(500).json({
        status:'User not registered!'
      });
    }
    user.name.firstname = req.body.firstname;
    user.name.lastname = req.body.lastname;
    user.gender = req.body.gender;
    user.rollNo = req.body.rollNumber;
    user.program = req.body.programme;
    user.branch = req.body.branch;
    user.doj = req.body.doj;
    user.dob = req.body.dob;
    user.save(function() {
      res.status(200).json({
        status: "successful"
      });
    });
  });
});
module.exports = router;