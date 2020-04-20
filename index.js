var path=require('path');
var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var app=express();
var session=require('express-session');
var MongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon')

//Route to model and controller
var user_route = require('./route/login');
var register_user_route= require('./route/register_user');
var error_handling_route=require('./route/error');
var show_user_route= require('./route/show_user');

// Form Data
app.use(bodyParser.json());
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
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//user model and controller
app.use('/', user_route);
app.use('/', register_user_route);
app.use('/', error_handling_route);
app.use('/', show_user_route);

// Run the Server
var port = process.env.PORT || 3000
app.listen(port)
console.log('listen to server ' +3000+' connected.');



// Show the Index Page
app.get('/',function(req,res){
    res.render('index',{title:"Sistem Penggantian Guru",'description':'This is Home page description.'});
});

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Public Folder as static Path
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))



