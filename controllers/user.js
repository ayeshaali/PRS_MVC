var express = require('express');
var fs = require("fs");
var router = express.Router();
var Users = require('../models/User');
var dataJS = require('../models/data');
var Villains = require('../models/Villain');
var userName;
var userPSWD;

//login request; renders either index if password is wrong or game if new user created or correct login entered
router.get('/users/game', function(request, response){
  dataJS.log("GET REQUEST /users/game: "+request.query.player_name+" at "+ new Date());
  Villains.changeColors();
  //set up data
  var user_data={
    name: request.query.player_name,
    pswd: request.query.pswd
  };
  userName = user_data["name"];
  userPSWD = user_data["pswd"];
  Users.getUser(userName, function(user_data){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    if (user_data["name"] == "") {//if someone accidentally submits login w/o entering anything
      dataJS.log(user_data["name"]);
      dataJS.increment("index")
      response.render('index', {page:request.url, user:user_data, title:"Index"});
    } else if (user_data.pswd == userPSWD) {
      dataJS.increment("game")
      response.render('game', {page:request.url, user:user_data, title:"index"});
    } else {
      user_data["failure"] = 4;
      userName = "";
      userPSWD = "";
      dataJS.increment("index")
      response.render('index', {page:request.url, user:user_data, title:"Index"});
    }
  });
});

//request for when user wants to play again; basically exactly the same as the login request w/o having to log in again
router.get('/playAgain', function(request, response){
  dataJS.log("GET /playAgain at"+new Date());
  //use the saved username and password which resets when you return to login page
  var user_data={};
  user_data["name"] = userName;
  user_data["pswd"] = userPSWD;
  // var csv_data = dataJS.loadCSV("data/users.csv");
  //if the saved username is empty than return to index page
  if (user_data["name"] == "") {//if someone accidentally submits login w/o entering anything
    dataJS.increment("index")
    response.render('index', {page:request.url, user:user_data, title:"Index"});
  } else {
    dataJS.increment("game")
    response.render('game', {page:request.url, user:user_data, title:"playGame"});
  }
});

//request for when user does not choose a valid weapon or villain
router.get('/error', function(request, response){
  //use the saved username and password which resets when you return to login page
  var user_data={};
  user_data["name"] = userName;
  user_data["pswd"] = userPSWD;
  dataJS.increment("game")
  response.render('game', {page:request.url, user:user_data, title:"error"});
});

//request for when user clicks create account
router.get('/user/new', function(req, res){
  dataJS.log("GET REQUEST /users/new at"+ new Date());
  var u;
  var feedback = {
    failure:0
  }
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  dataJS.increment("user_details")
  res.render('user_details', {user:u, feedback:feedback, title:"create"});
});

//request for when user creates an account
router.post('/users',function(req,res){
  dataJS.log('POST Request- /Users'+" at "+ new Date());
  var u = {
    name: req.body.player_name,
    pswd: req.body.pswd,
    first: req.body.first,
    last: req.body.last
  }
  var feedback = {
    failure: 0
  }
  Users.createUser(u.name, u.pswd, u.first,u.last, function(result, feedbackN){
    if (result) {
      res.redirect('/');
    } else {
      var u;
      feedback["failure"] = feedbackN;
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      dataJS.increment("user_details")
      res.render('user_details', {user:u, feedback:feedback, title:"create"});
    }
  });
});

//request for when user chooses to edit account after logging in
router.get('/user/:id/edit', function(req, res){
  dataJS.log("GET REQUEST /users/"+req.params.id+"/edit"+" at "+ new Date());
  var feedback = {
    failure:0
  }
  var u = Users.getUser(req.params.id, function(u){
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    dataJS.increment("user_details")
    res.render('user_details', {user:u, feedback:feedback, title:"update"});
  });
});

//request for when user chooses to delete account
router.delete('/user/:id', function (req, res) {
  dataJS.log("DELETE REQUEST /users/"+req.params.id+" at "+ new Date());
  Users.deleteUser(req.params.id, function(){
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.redirect('/');
  });
})

//request for when user updates account
router.put('/user/:id', function (req, res) {
  dataJS.log("PUT REQUEST /users/"+req.params.id+" at "+ new Date());
  var u = {
    original_name: req.params.id,
    name: req.body.player_name,
    pswd: req.body.pswd,
    first: req.body.first,
    last: req.body.last
  }
  dataJS.log(u);
  var feedback = {
    failure:0
  }

  if (u.name==null||u.name==""||u.pswd==null||u.pswd==""||u.first==null||u.first==""||u.last==null||u.last==""){
      dataJS.log("inv");
      result= false;
      feedbackN = 42;
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      dataJS.increment("user_details")
      res.render('user_details', {user:u, feedback:feedback, title:"update"});
  }

  if (u.original_name != u.name) {
    Users.getUser(u.name, function(user) {
      if (user.name == "notarealuser") {
        Users.getUser(u.original_name, function(original_user) {
          var date = Users.returnDate();
          var user_array = [u.name, u.pswd, original_user.total, original_user.wins, original_user.losses, original_user.rock, original_user.paper, original_user.scissors, u.first, u.last, original_user.creation, date]
          Users.updateUser(u.original_name, user_array, function(){
            res.status(200);
            res.setHeader('Content-Type', 'text/html')
            Users.getUser(u.name, function(tjret){
              dataJS.increment("user_details")
              res.render('user_details', {user:tjret, feedback:feedback, title:"update"});
            })
          });
        });
      } else {
        Users.getUser(u.original_name, function(tjret){
          feedback["failure"] = 10;
          res.status(200);
          res.setHeader('Content-Type', 'text/html')
          dataJS.increment("user_details")
          res.render('user_details', {user:tjret, feedback:feedback, title:"update"});
        })
      }
    });
  } else {
      Users.getUser(u.original_name, function(original_user) {
        var date = Users.returnDate();
        var user_array = [u.original_name, u.pswd, original_user.total, original_user.wins, original_user.losses, original_user.rock, original_user.paper, original_user.scissors, u.first, u.last, original_user.creation, date]
        Users.updateUser(u.original_name, user_array, function(){
          res.status(200);
          res.setHeader('Content-Type', 'text/html')
          Users.getUser(u.original_name, function(tjret) {
            dataJS.increment("user_details")
            res.render('user_details', {user:tjret, feedback:feedback, title:"update"});
          })
        });
      });
    }
});

//game handling
router.get('/user/:id/results', function(request, response){
  dataJS.log("GET REQUEST /users/"+request.params.id+"/results"+" at "+ new Date());
  var user_data={
    name: request.params.id,
    pswd: request.params.pswd,
    weapon: request.query.weapon,
    villain: request.query.villain
  };

  var villainPrevious=fs.readFileSync("data/villainPrevious.txt",'utf8');
  var userPrevious=fs.readFileSync("data/userPrevious.txt",'utf8');

  if (user_data.weapon=="error"||user_data.villain=="error"){
    response.redirect("/error");
  } else{
    var villainWeapon= "";
    var arr = Users.handleThrow(user_data.weapon, user_data.villain, villainWeapon, villainPrevious,userPrevious);
    user_data["result"] = arr[0];
    user_data["response"] =arr[1];

    Users.getUser(user_data.name, function(user_obj) {
      user_obj.total =parseInt(user_obj.total)+1
      user_obj[user_data.weapon]=parseInt(user_obj[user_data.weapon])+ 1
      switch(user_data["result"]){
        case "won":
          user_obj.wins =parseInt(user_obj.wins)+1
          break;
        case "lost":
          user_obj.losses =parseInt(user_obj.losses)+1
          break;
      }
      var user_array = [user_obj.name, user_obj.pswd, user_obj.total, user_obj.wins, user_obj.losses, user_obj.rock, user_obj.paper, user_obj.scissors, user_obj.first, user_obj.last, user_obj.creation, user_obj.update]
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
            dataJS.increment("results")
            response.render('results',{page:request.url, user:user_data, title:"results"});
          });
        });
      });
    });
  }
});

module.exports = router;
