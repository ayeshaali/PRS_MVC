//PRS Showdown
//Authors: Sadi Gulcelik, Ayesha Ali
//Date: 1/18/19

//required packages
var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');
var app = express();
var Users = require(__dirname +'/models/User');
var Villains = require(__dirname +'/models/Villain');
var dataJS = require(__dirname +'/models/data');
var Routes = require(__dirname +'/controllers/user');
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

//set up server
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));
app.use(express.urlencoded());

//variables for login and villain strategies
var villainPrevious=Villains.randomChoice();
var userPrevious=Villains.randomChoice();
fs.writeFileSync("data/villainPrevious.txt",villainWeapon,'utf8')
fs.writeFileSync("data/userPrevious.txt",userPrevious,'utf8')
var villainWeapon;
var userName;
var userPSWD;
var error = false;

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server started at '+ new Date()+', on port ' + port+'!');
});

app.use(require('./controllers/user'));


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
app.get('/login', function(request, response){
  Users.changeColors();
  //set up data
  var user_data={
    name: request.query.player_name,
    pswd: request.query.pswd
  };
  userName = user_data["name"];
  userPSWD = user_data["pswd"];
  var user_obj = Users.getUser(userName, function(user_data){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')

    if (user_data["name"] == "") {//if someone accidentally submits login w/o entering anything
      response.render('index', {page:request.url, user:user_data, title:"Index"});
    } else if (user_obj.pswd == userPSWD) {
      response.render('game', {page:request.url, user:user_data, title:"valid"});
    } else {
      user_data["failure"] = 4;
      userName = "";
      userPSWD = "";
      response.render('index', {page:request.url, user:user_data, title:"Index"});
    }
  });
});

//request for when user wants to play again; basically exactly the same as the login request w/o having to log in again
app.get('/playAgain', function(request, response){
  //use the saved username and password which resets when you return to login page
  var user_data={};
  user_data["name"] = userName;
  user_data["pswd"] = userPSWD;
  var csv_data = dataJS.loadCSV("data/users.csv");
  //if the saved username is empty than return to index page
  if (user_data["name"] == "") {//if someone accidentally submits login w/o entering anything
    response.render('index', {page:request.url, user:user_data, title:"Index"});
  } else {
    response.render('game', {page:request.url, user:user_data, title:"valid"});
  }
});

//handles a request for the rules page (sends the user to the rules page)
app.get('/rules', function(request, response){
  user_data = {}
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('rules', {page:request.url, user:user_data, title:"rules"});
});

//handles a request for the rules page (inputs the necessary data and sends the user to the newly rendered stats page)
app.get('/stats', function(request, response){
  var user_data = dataJS.loadCSV("data/users.csv");
  var villain_data = dataJS.loadCSV("data/villains.csv")
  var data = {};
  data["player"] = user_data;
  data["villain"] = villain_data;
  console.log(user_data);
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
