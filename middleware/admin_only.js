var User = require('../models/user');

module.exports=function admin_only(req, res, user, next) {
  User.findById(req.session.userId).exec(function (error, user){
    if (user.roles=='Admin') 
  {
    var err = new Error('You must be Admin to view this page.');
    err.status = 402;
    return next(err);
    
  } else {
    return next();
  }
  });
  
}