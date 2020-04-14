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




