var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');

var app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));

app.use(require('./controllers/user'));
var Users = require(__dirname +'/models/User');


var port = 3000;
app.listen(port, function(){
  console.log('Server started at '+ new Date()+', on port ' + port+'!');
});

app.get('/', function(request, response){
  console.log('Request- default route');
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index');
});

app.get('/login', function(request, response){
  console.log('Request- login');

  var u = Users.getUser(request.query.player_name);

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('game', {user:u});
});

app.get('/:user/results', function(request, response){
  console.log('Request- /'+request.params.user+'/results');

  var user_data={
      name: request.params.user,
      weapon: request.query.weapon
  };

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.send(JSON.stringify(user_data));
});

app.get('/rules', function(request, response){
  console.log('Request- rules');
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('rules');
});

app.get('/stats', function(request, response){
  console.log('Request- stats');

  var user_data=[];
  //1. Load the data from the .csv
  var user_file=fs.readFileSync("data/users.csv", "utf8");
  //2. Parse the data from the .csv into a convenient (non-String) format
  var user_lines = user_file.split('\n');
  for(var i=1; i<user_lines.length-1; i++){
      var user_object={};
      var single_user = user_lines[i].trim().split(',');
      user_object["name"]=single_user[0];
      user_object["games played"]=parseInt(single_user[1]);
      user_object["games won"]=parseInt(single_user[2]);
      user_object["games lost"]=parseInt(single_user[3]);
      user_data.push(user_object);
  }

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('stats', {users:user_data});
});

app.get('/about', function(request, response){
  console.log('Request- about');
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('about');
});
