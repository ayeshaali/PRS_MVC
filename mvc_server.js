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
fs.writeFileSync("data/villainPrevious.txt",villainPrevious,'utf8')
fs.writeFileSync("data/userPrevious.txt",userPrevious,'utf8')

var error = false;

var port = process.env.PORT || 3000;
app.listen(port, function(){
  dataJS.log('Server started at '+ new Date()+', on port ' + port+'!');
});

app.use(require('./controllers/user'));
//first request, renders index
app.get('/', function(request, response){
    dataJS.increment("index");
  var user_data={};
  userName = "";
  userPSWD = "";
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index', {page:request.url, user:user_data, title:"Index"});
});

//handles a request for the rules page (sends the user to the rules page)
app.get('/rules', function(request, response){
    dataJS.increment("rules");
  user_data = {}
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('rules', {page:request.url, user:user_data, title:"rules"});
});

//handles a request for the rules page (inputs the necessary data and sends the user to the newly rendered stats page)
app.get('/stats', function(request, response){
    dataJS.increment("stats");
  dataJS.loadGoogle(1, function(user_data){
    dataJS.loadGoogle(2, function(villain_data){
      var data = {};
        
        //sorting by win rate
        user_data.sort(function(a,b) {var bPercent = 0;if (b.total == 0) {bPercent = 0;  } else {bPercent =Math.round((b.wins/b.total)*100); } var aPercent = 0; if (a.total == 0) { aPercent = 0; } else {aPercent =Math.round((a.wins/a.total)*100);}return (bPercent-aPercent); });
        
        
      data["player"] = user_data;
    
        //sorting by win rate
     villain_data.sort(function(a,b) {var bPercent = 0;if (b.total == 0) {bPercent = 0;  } else {bPercent =Math.round((b.wins/b.total)*100); } var aPercent = 0; if (a.total== 0) { aPercent = 0; } else {aPercent =Math.round((a.wins/a.total)*100);}return (bPercent-aPercent); });
    
      data["villain"] = villain_data;
      dataJS.log(user_data);
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render('stats', {page:request.url, user:data, title:"stats"});
    });
  });
});

//handles a request for the rules page (sends the user to the rules page)
app.get('/about', function(request, response){
    dataJS.increment("about");
  user_data = {};
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('about', {page:request.url, user:user_data, title:"about"});
});
