var express = require('express');
var router = express.Router();
var User = require('../models/user');
var CheckIn = require('../models/attendance');
var mid  = require('../middleware/requiresLogin.js');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');



//Login Logic start

router.get('/login',  function(req,res){
  req.flash("Sila Login", "Login Success")
  res.render('login', { });
});


router.post('/login',  function (req, res, next) {
  if (req.body.username && req.body.password)
  {
    User.authenticate(req.body.username, req.body.password, function (error, user)
    {
      if (error || !user)
      {
        req.flash('info', 'Wrong Password or Wrong Username Please Login Again');
        return res.redirect('/login');
      }
      else
      {
        req.session.userId = user._id;
        if(user.roles=='Admin')
        {
          return res.redirect(`/admin`);
        }else if(user.roles=='Teacher')
        {
          console.log('teacher login');
          return res.redirect('/teacher');
        }else
        {
          console.log('Time Table Creator login');
          return res.redirect('/creator');
        }
        
      }
    });
  }else
  {
    
    req.flash('error', 'Fill out the field');
    return res.redirect('/login');
  }
});

//Login Logic ends


//Get page after login
router.get('/admin',mid, function(req,res){
    if (! req.session.userId )  
    {
      var err = new Error("You are not authorized to view this page.");
      err.status = 403;
      return next(err);
    } else 
    {
      User.findById(req.session.userId).exec(function (error, user) {
        if (error) 
        {
          return next(error);

        } else
        {
          console.log(user);
          CheckIn.find({userId:req.session.userId},function(err,users) { //Get Attendance list
            if (err) throw err;
            res.render('admin_dashboard',{'users':users, 'user':user });
          });
          
          ;
        }
      });
    }
  
  
});


//get Teacher landing page
router.get('/teacher', mid,  function(req, res) {
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          console.log(user);
          CheckIn.find({userId:req.session.userId},function(err,users) {
            if (err) throw err;
            res.render('teacher_dashboard',{'users':users , 'user':user});
          });
     
          ;
        }
      });
    
});

router.get('/creator',mid, function(req,res){
  if (! req.session.userId )  
  {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  } else 
  {
    User.findById(req.session.userId).exec(function (error, user) {
      if (error) 
      {
        return next(error);

      } else
      {
        console.log(user);
        CheckIn.find({userId:req.session.userId},function(err,users) { //Get Attendance list
          if (err) throw err;
          res.render('timetable_creator',{'users':users, 'user':user });
        });
        
        ;
      }
    });
  }


});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    console.log(req.session.userId,'logout');
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

//Forgot Password

router.get('/forgot', function(req, res) {
  res.render('forgot');
});


router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ username: req.body.email }, function(err, user) {
        if (!user) {
          console.log("No account with that email address exists.");
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'taqiuddinshokordey@gmail.com',
          pass: '#netvista277707#taqi1994'
        }
      });

      var mailOptions = {
        to: user.username,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    console.log(user);
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {user: req.user});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        
        user.save(function(err) {
          
            done(err, user);
          
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'taqiuddinshokordey@gmail.com',
          pass: '#netvista277707#taqi1994'
        }
      });
      var mailOptions = {
        to: user.username,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});



module.exports = router;

