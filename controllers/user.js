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
    first: req.body.first,
    last: req.body.last
  }
  if(Users.createUser(u.name, u.pswd, u.first,u.last)){
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
    first: req.body.first,
    last: req.body.last
  }
  console.log(u);
  user = Users.getUser(u.name);
  if (u.original_name != u.name) {
    if (user.name = "notarealuser") {
      Users.createUser(u.name, u.pswd, u.first,u.last)
      Users.deleteUser(u.original_name)
    } else {
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render('user_details', {user:Users.getUser(u.original_name)});
    }
  } else {
    Users.updateUser(u.original_name, "pswd", u.pswd);
    Users.updateUser(u.first, "first", u.first);
    Users.updateUser(u.last, "last", u.last);
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
      user_obj.total =parseInt(user_obj.total)+1
      user_obj[user_data.weapon]+=parseInt(user_obj[user_data.weapon])+ 1
      switch(user_data["result"]){
        case "won":
          user_obj.wins =parseInt(user_obj.wins)+1
          break;
        case "lost":
          user_obj.losses =parseInt(user_obj.losses)+1
          break;  
      }
      var user_array = [user_obj.name, user_obj.pswd, user_obj.total, user_obj.wins, user_obj.losses, user_obj.rock, user_obj.paper, user_obj.scissors, user_obj.first, user_obj.last]
      Villains.getVillain(user_data.villain, function(villain_obj){
        villain_obj.total =parseInt(villain_obj.total)+1
        villain_obj[user_data["response"]]=parseInt(villain_obj[user_data["response"]])+1
        switch(user_data["result"]){
            case "won":
              villain_obj.losses = parseInt(villain_obj.losses)+1
              break;
            case "lost":
              villain_obj.wins = parseInt(villain_obj.wins)+1
              break;  
          }
        var villain_array = [villain_obj.name, villain_obj.total, villain_obj.wins, villain_obj.losses, villain_obj.rock, villain_obj.paper, villain_obj.scissors]

        Users.updateUser(user_obj.name, user_array, function(){
          Villains.updateVillain(villain_obj.name, villain_array, function(){
            response.status(200);
            response.setHeader('Content-Type', 'text/html')
            response.render('results',{page:request.url, user:user_data, title:"results"});
          });
        });  
      });
    });
  }
});

module.exports = router;
