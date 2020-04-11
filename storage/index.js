vSchema=mongoose.Schema;

// Creat Task Schema
var Task=new Schema({
    title:{type:String},
    description:{type:String}
});
var TaskModel=mongoose.model('Task',Task);

// Read Data Start
app.get('/crud',function(req,res){
    TaskModel.find({},function(err,docs){
        res.render('tasks',{'taskList':docs});
    });
});
// Read Data End

app.get('/login',function(req,res){
    res.render('login');
});

// Create Data Start
app.get('/crud/add',function(req,res){
    res.render('add-task');
});

// Add Task
app.post('/crud/add',function(req,res){
    if(req.body.title && req.body.description){
        // Add Data
        var newTask=new TaskModel({
            title:req.body.title,
            description:req.body.description
        });
        var message='Data has been added';
        newTask.save(function(err){
            if(err){
                var message='Data has not been added';
            }
        });
        // Show Message
    }
    res.render('add-task',{msg:message});
});
// Create Data End

// Update Data Start
app.get('/crud/edit/:id',function(req,res){
    TaskModel.findOne({_id:req.params.id},function(err,docs){
        res.render('edit-task',{'task':docs});
    });
});

app.post('/crud/edit/:id',function(req,res){
    // update Data
    var updateData={
        title:req.body.title,
        description:req.body.description
    };
    var message='Data has been not updated';
    TaskModel.update({_id:req.params.id},updateData,function(err,numrows){
        if(!err){
            res.redirect('/crud/edit/'+req.params.id);
        }
    });
});
// Update Data End

// Delete Task
app.get('/crud/delete/:id',function(req,res){
    // Delete Data
    TaskModel.remove({_id:req.params.id},function(err){
        if(!err){
            res.redirect('/crud');
        }
    });
});
// Delete Task ##End


app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
    });
  });

  router.get('/register', function(req, res) {
    res.render('register', { });
});
 

router.post('/register', function (req, res, next) {
    if (
      req.body.username &&
      req.body.password,
      req.body.designation ) {
  
      var userData = {
        username: req.body.username,
        password: req.body.password,
        designation: req.body.designation
      }
  
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) {
          return next(err)
        } else {
          return res.redirect('/login');
        }
      });
  
    } else {
      var err = new Error('All fields have to be filled out');
      err.status = 400;
      return next(err);
    }
  
  });