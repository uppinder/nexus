/**
 * Created by shivram on 12/3/17.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var group = require('../models/group.js');

router.post('/createnewGroup', function(req, res) {



    group_new = new group({
        name: req.body.name,
        description:req.body.description,
        members:[
            {
                _id: req.user._id,
                role: 'admin'
            }
        ],
        posts:[]
    });

    group_new.save(function(err){
        if (err) {
            console.log("I AM HERE TOO");
            console.log(err);
            return res.status(500).json({
                error: 'Could not create group.'
            });
        }
        console.log("SUCCESS");
        User.findById(req.user._id, function(err, user) {
            user.groups.addToSet(group_new._id);

            user.save(function(err) {
                if (err) {
                    console.log("Again error :( ");

                    console.log(err);
                    return res.status(500).json({
                        error: 'Could not create group.'
                    });
                }
            });

        });
        console.log("SUCCESSagain");

        return res.status(200).json({
            status: 'Group-create successful!',
            group_new: group_new
        });
    });

});
module.exports = router;