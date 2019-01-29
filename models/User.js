var fs = require("fs");
var dataJS = require(__dirname +'/data');


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

exports.updateUser = function(user_id, new_info) {
  console.log("Users.getUser");
  var user={
    name:"test"
  };

  return user;
}

exports.createUser = function(user_id, user_password) {
  
  user_data["games"] =0;
  user_data["total_games"] =0;
  user_data["wins"] =0;
  user_data["losses"] =0;
  user_data["rock"] =0;
  user_data["paper"] =0;
  user_data["scissors"] = 0;
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
