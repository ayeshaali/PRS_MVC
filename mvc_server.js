//PRS Showdown
//Authors: Sadi Gulcelik, Ayesha Ali
//Date: 1/18/19

//required packages
var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');
var app = express();
app.use(require('./controllers/user'));
var Users = require(__dirname +'/models/User');
var Villains = require(__dirname +'/models/Villain');
var dataJS = require(__dirname +'/models/data');
var Routes = require(__dirname +'/controllers/user');

//variables for login and villain strategies
var villainPrevious=Villains.randomChoice();
var userPrevious=Villains.randomChoice();
var villainWeapon;
var userName;
var userPSWD;
var error = false;

//set up server
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server started at '+ new Date()+', on port ' + port+'!');
});

//first request, renders index
app.get('/', function(request, response){
  var user_data={};
  userName = "";
  userPSWD = "";
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index', {page:request.url, user:user_data, title:"Index"});
});

//login request; renders either index if password is wrong or game if new user created or correct login entered

//handles a request for the rules page (sends the user to the rules page)
app.get('/rules', function(request, response){
  user_data = {}
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('rules', {page:request.url, user:user_data, title:"rules"});
});

//handles a request for the rules page (inputs the necessary data and sends the user to the newly rendered stats page)
app.get('/stats', function(request, response){
  var user_data = loadCSV("data/users.csv");
  var villain_data = loadCSV("data/villains.csv")
  var data = {};
  data["player"] = user_data;
  data["villain"] = villain_data
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('stats', {page:request.url, user:data, title:"stats"});
});

//handles a request for the rules page (sends the user to the rules page)
app.get('/about', function(request, response){
  user_data = {};
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('about', {page:request.url, user:user_data, title:"about"});
});

app.route(Routes);
