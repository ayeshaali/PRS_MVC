var express = require('express');
var router = express.Router();

var Users = require('../models/User');
var DataJS = require('../models/data');
var Villains = require('../models/Villain');

router.get('/user/:id', function(req, res){
  console.log('Request- /user/'+req.params.id);
  var u = Users.getUser(req.params.id);
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.get('/login', function(request, response){
  Users.changeColors();
  //set up data
  var user_data={
    name: request.query.player_name, 
    pswd: request.query.pswd
  };
  userName = user_data["name"];
  userPSWD = user_data["pswd"];
  var user_obj = Users.getUser(userName);
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  
  if (user_data["name"] == "") {//if someone accidentally submits login w/o entering anything
    response.render('index', {page:request.url, user:user_data, title:"Index"});
  } else if (user_obj.name == "test"){ //if user isn't found in CSV
    Users.createUser(userName, userPSWD);
    response.render('game', {page:request.url, user:user_data, title:"game"});
  } else if (user_obj.pswd == userPSWD) {
    response.render('game', {page:request.url, user:user_data, title:"valid"});
  } else {
    user_data["failure"] = 4;
    userName = "";
    userPSWD = "";
    response.render('index', {page:request.url, user:user_data, title:"Index"});
  }
});

//request for throw choice
router.get('/:user/results', function(request, response){
  var user_data={
    name: request.params.user,
    weapon: request.query.weapon,
    villain: request.query.villain
  };
  
  if (fs.existsSync("data/villainPrevious.txt")) {
    villainPrevious=fs.readFileSync("data/villainPrevious.txt",'utf8');
  }
  if (fs.existsSync("data/userPrevious.txt")) {
    userPrevious=fs.readFileSync("data/userPrevious.txt",'utf8');
  }
  
  if (user_data.weapon=="error"||user_data.villain=="error"){
    return response.redirect('/playAgain');
  } else{
    var villainWeapon= "";
    user_data["result"] = Users.handleThrow(user_data.weapon, user_data.villain, villainWeapon, villainPrevious,userPrevious);
    user_data["response"] =villainWeapon;
    
    var user_obj = Users.getUser(user_data.name);
    Users.updateUser(user_data.name, "total_games", user_obj.total_games + 1);
    Users.updateUser(user_data.name, user_data.weapon, user_obj[user_data.weapon] + 1);
    switch(user_data["result"]){
      case "won":
      Users.updateUser(user_data.name, "wins", user_obj.wins + 1);        
      break;
      case "lost":
      Users.updateUser(user_data.name, "losses", user_obj.losses + 1);        
      break;
    }
    
    //manage villain CSV for games, wins, losses, and weapon used
    var villain_obj = Villains.getVillain(user_data.villain);
    Villains.updateVillain(user_data.villain, "total_games", villain_obj.total_games + 1);
    Villains.updateVillain(user_data.villain, user_data.response, villain_obj[user_data.response] + 1);
    switch(user_data["result"]){
      case "lost":
      Villains.updateVillain(user_data.villain, "wins", villain_obj.wins + 1);        
      break;
      case "won":
      Villains.updateVillain(user_data.villain, "losses", villain_obj.losses + 1);        
      break;
    }
    
    //render results
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('results',{page:request.url, user:user_data, title:"results"});
  }
});

//request for when user wants to play again; basically exactly the same as the login request w/o having to log in again
router.get('/playAgain', function(request, response){
  //use the saved username and password which resets when you return to login page
  var user_data={};
  user_data["name"] = userName;
  user_data["pswd"] = userPSWD;
  var csv_data = loadCSV("data/users.csv");
  //if the saved username is empty than return to index page
  if (user_data["name"] == "") {//if someone accidentally submits login w/o entering anything
    response.render('index', {page:request.url, user:user_data, title:"Index"});
  } else {
    response.render('game', {page:request.url, user:user_data, title:"valid"});
  } 
});


module.exports = router;
