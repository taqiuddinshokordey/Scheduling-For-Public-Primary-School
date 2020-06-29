var path=require('path');
var express=require('express');
var flash = require('connect-flash');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var app=express();
var session=require('express-session');
var MongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');


//Route to model and controller
var user_route = require('./route/login');
var register_user_route= require('./route/register_user');
var classroom_route=require('./route/classroom');
var subject_route= require('./route/subject');
var timetable_route= require ('./route/timetable');
var attendance_route= require ('./route/attendance');
var settings_route= require('./route/settings');
var add_teacher_route=require('./route/teacher_add');
var relief_route=require('./route/timetable_relief')


// Form Data
app.use(bodyParser.json()); //ini adalah contoh perubhan
app.use(bodyParser.urlencoded({extended:true}));


//connect to MongoDB
mongoose.connect('mongodb+srv://taqiuddinshokordey:netvista277707@finalyearproject-kimkb.gcp.mongodb.net/Scheduling_system?retryWrites=true&w=majority'
//mongoose.connect('mongodb://localhost:27017/admin'
,{ useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true, 

},);
var db = mongoose.connection;
mongoose.connection.on('open',function() {
  console.log('Mongoose connected.');
});


///use sessions for tracking logins
app.use(session({
  secret: 'sadbsakdsadsahdka',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  
  
}));

app.use(flash()); // use connect-flash for flash messages stored in session


//user model and controller
app.use('/', user_route);
app.use('/', register_user_route);
app.use('/', classroom_route);
app.use('/', subject_route);
app.use('/', timetable_route);
app.use('/', attendance_route);
app.use('/', settings_route);
app.use('/', add_teacher_route);
app.use('/', relief_route);


// Run the Server
var port = process.env.PORT || 3000
app.listen(port)
console.log('listen to server ' +3000+' connected.');

// Show the Index Page
app.get('/',function(req,res){
    res.render('index',{title:"Relief Timetable and Attendance System",'description':'This is Home page description.'});
});

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Public Folder as static Path
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// error handling


app.use(function(error, req, res, next) {
  res.status(400);
res.render('error/400', {title:'No Access', error: error});
});

 app.use(function(error, req, res, next) {
  res.status(401);
res.render('error/401', {title:'No Access', error: error});
});


app.use(function(error, req, res, next) {
  res.status(402);
res.render('error/402', {title:'No Access', error: error});
});







