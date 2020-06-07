var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid  = require('../middleware/requiresLogin.js');
var json2csv = require('json2csv').parse;
var multer      = require('multer'); 

var storage = multer.diskStorage({  
  destination:(req,file,cb)=>{  
      cb(null,'./public/uploads');  
  },  
  filename:(req,file,cb)=>{  
      cb(null,file.originalname);  
  }  
});  

var uploads = multer({storage:storage});
//show user list

router.get('/admin_user',mid, function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      User.find({},function(err,users){
        if (err) throw err;
        res.render('admin_content/admin_user',{'users':users, user:user});
      });
    }
  });
  
});


//Register User
router.get('/register',mid, function(req, res, user) {
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      return res.render('admin_content/register_user', { user:user});
      ;
    }
  });
  
});

/*Register Using CSV Files bulk

router.get('/template', function(req, res) {
 
  var fields = [
      'username',
      'password',
      'roles',
      'name',
  ];

  var csv = json2csv({ data: '', fields: fields });

  res.set("Content-Disposition", "attachment;filename=template.csv");
  res.set("Content-Type", "application/octet-stream");

  res.send(csv);

});

router.post('/upload_csv', function (req, res) {
  if (!req.files)
      return res.status(400).send('No files were uploaded.');
   
  var authorFile = req.files.file;

  var authors = [];
       
  csv
   .fromString(authorFile.data.toString(), {
       headers: true,
       ignoreEmpty: true
   })
   .on("data", function(data){
       data['_id'] = new mongoose.Types.ObjectId();
        
       authors.push(data);
   })
   .on("end", function(){
       Author.create(authors, function(err, documents) {
          if (err) throw err;
       });
        
       res.send(authors.length + ' authors have been successfully uploaded.');
   });
}); */
 

router.get('/register_csv',mid, function(req, res, user) {
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      return res.render('admin_content/register_user_csv', { user:user});
      ;
    }
  });
  
});

//add new user 
 
router.post('/register', function (req, res, next) {
    if (
      req.body.username &&
      req.body.password,
      req.body.name,
      req.body.roles ) {
  
      var userData = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        roles: req.body.roles
      }
  
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) {
          return next(err)
        } else 
        {
        if(user.roles=='teacher')
        {
          console.log('teacher Registered');
          return res.redirect('/admin_user');
        }
        console.log('User Registered');
        return res.redirect('/admin_user');
        }
      });
  
    } else {
      var err = new Error('All fields have to be filled out');
      err.status = 400;
      return next(err);
    }
  
  });

//Register Logic End



//user edit
router.get('/admin_user/edit/:id',function(req,res){
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      console.log(user);
      User.find({},function(err,users){
        if (err) throw err;
        User.findOne({_id:req.params.id},function(err,users){
          res.render('admin_content/edit_user',{'users':users, user:user});
      });
      });
      ;
    }
  });
});

router.post('/admin_user/edit/:id',function(req,res){
  // update Data
  var updateData={
    username: req.body.username,
    name: req.body.name,
    roles: req.body.roles
  };
  var message='Data has been not updated';
  User.updateOne({_id:req.params.id},updateData,function(err,numrows){
      if(!err){
        console.log('User Updated');
          res.redirect('/admin_user');
      }
  });
});

//end user edit

//user delete
router.get('/admin_user/delete/:id',function(req,res){
  User.deleteOne({_id:req.params.id},function(err){
    if(!err){
        res.redirect('/admin_user');
    }
});
});

//end user delete


module.exports = router;

