var express = require('express');
var router = express.Router();
var passport = require('passport');

var verify = require('./verify.js');
var User = require('../models/user.js');

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
  
    if (!user) {

      var userDetails = {
        username: req.body.username,
        password: req.body.password,
        mailServer: req.body.mailServer
      };

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

        } else {
          return res.status(401).json({
            err:info
          });
        }
      });

    } else {

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
    if(err || !user)
      res.status(500);

    user.verified = true;
    user.save(function() {
      res.status(200).json({
        status:'Verification done!'
      });
    });

  });
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