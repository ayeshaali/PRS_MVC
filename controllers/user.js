var express = require('express');
var fs = require("fs");
var router = express.Router();

var Users = require('../models/User');
var DataJS = require('../models/data');
var Villains = require('../models/Villain');


router.delete('/user', function (req, res) {
  console.log('DELETE Request-');
})

router.put('/user', function (req, res) {
  console.log('PUT Request-');
})


router.post('/Users',function(req,res){
  console.log('POST Request- /Users');
  var u = {
    name: req.body.player_name,
    pswd: req.body.pswd,
    first_name: req.body.first_name,
    last_name: req.body.last_name
  }
  Users.createUser(u.name, u.pswd, u.first_name,u.last_name)
  res.redirect('/');
});

//does the actual editing process
router.get('/user/:id', function(req, res){
  //put in user stuff to make ejs work
  var u = Users.getUser(req.params.id);
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.post('/user/:id', function(req, res){

});


router.get('/user/:id/edit', function(req, res){
  console.log('Request- /user/'+req.params.id);
  var u = Users.getUser(req.params.id);
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.get('/user/new', function(req, res){
  var u = {};
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

//request for throw choice
router.get('/:user/results', function(request, response){
  var user_data={
    name: request.params.user,
    weapon: request.query.weapon,
    villain: request.query.villain
  };

  var villainPrevious=fs.readFileSync("data/villainPrevious.txt",'utf8');
  var userPrevious=fs.readFileSync("data/userPrevious.txt",'utf8');
  
  if (user_data.weapon=="error"||user_data.villain=="error"){
    return response.redirect('/playAgain');
  } else{
    var villainWeapon= "";
    user_data["result"] = Users.handleThrow(user_data.weapon, user_data.villain, villainWeapon, villainPrevious,userPrevious);
    
    user_data["response"] =villainWeapon;
    console.log("show please "+user_data.response);
    
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



module.exports = router;
