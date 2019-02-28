var fs = require("fs");
var dataJS = require(__dirname +'/data');
var villainJS = require(__dirname +'/Villain');

//gets a user
exports.getUser = function(user_id, callback) {
  var user = createBlankUser();
  var all_users = dataJS.loadGoogle(1, function(all_users) {
    for(var i=0; i<all_users.length; i++){
      if(all_users[i].name==user_id.trim()){
        user = all_users[i];
        break;
      }
    }
    callback(user);
  });
}


//creates a user
exports.createUser = function(user_id, user_password,first_name,last_name, callback) {
    var result = true;
    var feedbackN = 0;
    if (user_id==null||user_id==""||first_name==null||first_name==""||last_name==null||last_name==""||user_password==null||user_password==""){
        dataJS.log("inv");
        result= false;
        feedbackN = 42;
    }

    exports.getUser(user_id, function(user){
      if (user.name != "notarealuser") {
        result = false;
        feedbackN = 10;
      }

      if (result) {
        date=returnDate();
        var new_obj = {
          "name": user_id,
          "pswd": user_password,
          "total": 0,
          "wins": 0,
          "losses": 0,
          "rock": 0,
          "paper": 0,
          "scissors": 0,
          "first": first_name,
          "last": last_name,
            "creation": date,
            "update": date
        }
        dataJS.createRow(new_obj, function(){
          dataJS.log("Calling second callback")
          callback(true, feedbackN);
        })
      } else {
        callback(false, feedbackN);
      }
    })
}
exports.returnDate=function(){
    return returnDate();
}
function returnDate(){
    var d=new Date(); 
    var day=["Sunday","Monday","Tuesday","Wednesday","Thursday", "Friday", "Saturday"][d.getDay()];
    var month=["January","February","March","April", "May", "June","July","August","September", "October", "November","December"][d.getMonth()];
    return (""+day+" "+month+" "+addsuffix(d.getDate())+", "+ d.getFullYear()+"  "+d.getHours()+":"+fix(d.getMinutes())+":"+fix(d.getSeconds()));
}
function fix(n){
    return ("0" + n).slice(-2);
}
function addsuffix(i) {
    var a=i%100;
    if (a==11||a==12||a==13){
        return i+"th";
    }
    switch(i%10){
        case 1:
            return i+"st";
        case 2:
            return i+"nd";
        case 3:
            return i+"nd"
    }
    return i+"th";
}

//deletes a user
exports.deleteUser = function(user_id, callback) {
  dataJS.deleteRow(user_id, callback)
}

//updates the date for a user
exports.updateUser = function(user_id, updates, callback) {
  dataJS.updateRow(0, user_id, updates, callback)
}

//handles a throw
exports.handleThrow = function(userWeapon, villain, villainWeapon, villainPrevious, userPrevious){
    villainWeapon=villainJS.villainStrategies(villain,villainPrevious,userPrevious,userWeapon);
    var result = [];
    switch(userWeapon){
        case villainWeapon:
          result[0] = "drew";
          break;
        case villainJS.winAgainst(villainWeapon):
          result[0] = "won";
          break;
        case villainJS.loseAgainst(villainWeapon):
          result[0] = "lost";
          break;
    }

    result[1]=villainWeapon;
    return result;
    fs.writeFileSync("data/villainPrevious.txt",villainWeapon,'utf8')
    fs.writeFileSync("data/userPrevious.txt",userWeapon,'utf8')
}


//bug testing (creates blank user)
var createBlankUser= function(){
  var user={
    name:"notarealuser",
    games_played:"test",
    lost:"test",
    won:"test",
    password:"test"
  };
  return user;
}
