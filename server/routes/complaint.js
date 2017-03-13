/**
 * Created by shubz on 12/3/17.
 */
var router = require('express').Router();
var User = require('../models/user');
var Complaint = require('../models/complaint');
router.post('/register', function(req, res) {
    User.findById(req.user._id, function(err,user) {
        if(err) {
            console.log(err);
            return res.status(400).json({
                status: "Couldn't find user"
            });
        }
        if(req.body.complaints.isanonymous==true) {
            var new_complaint = new Complaint({
                body: req.body.complaints.body,
                isanonymous: req.body.complaints.isanonymous,
                file: req.body.complaints.file
            });
        }
        else {
            var new_complaint = new Complaint({
                body: req.body.complaints.body,
                isanonymous: req.body.complaints.isanonymous,
                user: req.user._id,
                file: req.body.complaints.file
            });
        }
        // console.log(req);
        console.log(new_complaint);
        new_complaint.save(function (err) {
            if(err) {
                console.log("complaint not saved");
                return res.status(400).json({
                    status: "complaint not saved"
                });
            }
            if(new_complaint.isanonymous==false)
            {
                user.complaint.addToSet(new_complaint._id);
                user.save(function (err) {
                    if(err)
                    {
                        console.log("complainfdfdt not saved");
                        res.status(400).json({
                            status: "complaintsdfsd not saved"
                        });
                    }
                    return res.status(200).send("complaint saved in user");
                });
            }
        });
    });
});

module.exports = router;