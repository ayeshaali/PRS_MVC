var express = require('express');
var fs = require("fs");
var router = express.Router();
var Users = require('../models/User');
var DataJS = require('../models/data');
var Villains = require('../models/Villain');

router.get('/user/new', function(req, res){
  var u;
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.post('/users',function(req,res){
  console.log('POST Request- /Users');
  var u = {
    name: req.body.player_name,
    pswd: req.body.pswd,
    first_name: req.body.first_name,
    last_name: req.body.last_name
  }
  if(Users.createUser(u.name, u.pswd, u.first_name,u.last_name)){
  res.redirect('/');
  }
    else{
    user_data={};
    user_data["failure"] = 42;
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {user:user_data});
    }
});

router.get('/user/:id/edit', function(req, res){
  console.log('Request- /user/'+req.params.id);
  var u = Users.getUser(req.params.id, function(u){
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {user:u});
  });
});

router.delete('/user/:id', function (req, res) {
  console.log('DELETE Request-');
  Users.deleteUser(req.params.id);
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.redirect('/');
})

router.put('/user/:id', function (req, res) {
  var u = {
    original_name: req.params.id,
    name: req.body.player_name,
    pswd: req.body.pswd,
    first_name: req.body.first_name,
    last_name: req.body.last_name
  }
  console.log(u);
  user = Users.getUser(u.name);
  if (u.original_name != u.name) {
    if (user.name = "notarealuser") {
      Users.createUser(u.name, u.pswd, u.first_name,u.last_name)
      Users.deleteUser(u.original_name)
    } else {
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render('user_details', {user:Users.getUser(u.original_name)});
    }
  } else {
    Users.updateUser(u.original_name, "pswd", u.pswd);
    Users.updateUser(u.first_name, "first_name", u.first_name);
    Users.updateUser(u.last_name, "last_name", u.last_name);
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
})

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
    var arr = Users.handleThrow(user_data.weapon, user_data.villain, villainWeapon, villainPrevious,userPrevious);
    user_data["result"] = arr[0];
    user_data["response"] =arr[1];

    Users.getUser(user_data.name, function(user_obj) {
      console.log(user_obj);
      Users.updateUser(user_data.name, "total_games", user_obj.total_games + 1, function(){
        Users.updateUser(user_data.name, user_data.weapon, user_obj[user_data.weapon] + 1, function(){
          switch(user_data["result"]){
            case "won":
            Users.updateUser(user_data.name, "wins", user_obj.wins + 1, function(){});
            break;
            case "lost":
            Users.updateUser(user_data.name, "losses", user_obj.losses + 1, function(){});
            break;  
          }
      
          // Villains.getVillain(user_data.villain, function(villain_obj){
          //   Villains.updateVillain(user_data.villain, "total_games", villain_obj.total_games + 1, function(){
          //     Villains.updateVillain(user_data.villain, user_data.response, villain_obj[user_data.response] + 1, function(){
          //       switch(user_data["result"]){
          //         case "lost":
          //         Villains.updateVillain(user_data.villain, "wins", villain_obj.wins + 1);
          //         break;
          //         case "won":
          //         Villains.updateVillain(user_data.villain, "losses", villain_obj.losses + 1);
          //         break;
                  response.status(200);
                  response.setHeader('Content-Type', 'text/html')
                  response.render('results',{page:request.url, user:user_data, title:"results"});
                }
              });
            });
          });
        });
      });
    });
  }
});

module.exports = router;
