var fs = require("fs");
var dataJS = require(__dirname +'/data');
var villainJS = require(__dirname +'/Villain');


exports.getUser = function(user_id) {
  console.log("Users.getUser: "+user_id);
  var user = createBlankUser();
  var all_users = dataJS.loadCSV("data/users.csv");
  for(var i=1; i<all_users.length; i++){
    if(all_users[i].name==user_id.trim()){
      user = all_users[i];
    }
  }
  return user;
}

exports.createUser = function(user_id, user_password) {
  var all_users = dataJS.loadCSV("data/users.csv");
  var user_data = {}
  user_data["name"] = user_id;
  user_data["pswd"] = user_password;
  user_data["games"] =0;
  user_data["total_games"] =0;
  user_data["wins"] =0;
  user_data["losses"] =0;
  user_data["rock"] =0;
  user_data["paper"] =0;
  user_data["scissors"] = 0;
  all_users.push(user_data);
  dataJS.uploadCSV(all_users, "data/users.csv");
} 

exports.deleteUser = function(user_id) {
  var all_users = dataJS.loadCSV("data/users.csv");
  var index;
  for(var i=1; i<all_users.length; i++){
    if(all_users[i].name==user_id.trim()){
      index = i;
    }
  }
  all_users.splice(i,1);
  dataJS.uploadCSV(all_users, "data/users.csv");
}

exports.updateUser = function(user_id, new_info) {
  console.log("Users.getUser");
  var user={
    name:"test"
  };

  return user;
}

exports.handleThrow = function(userWeapon, villain, villainPrevious, userPrevious){
    villainWeapon=villainJS.villainStrategies(villain,villainPrevious,userPrevious,userWeapon);
    switch(userWeapon){
        case villainWeapon:
          return("drew");
        case villainJS.winAgainst(villainWeapon):
            return("won");
        case villainJS.loseAgainst(villainWeapon):
            return("lost");
    }
}

var createBlankUser= function(){
  var user={
    name:"test",
    games_played:"test",
    lost:"test",
    won:"test",
    password:"test"
  };
  return user;
}
