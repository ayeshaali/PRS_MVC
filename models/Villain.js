var fs = require("fs");
var dataJS = require(__dirname +'/data');
var userJS = require(__dirname +'/User');

exports.getVillain = function(villain_id) {
  console.log("Users.getVillain: "+villain_id);
  var user;
  var all_users = dataJS.loadGoogle(2, function(all_users) {
    for(var i=0; i<all_users.length; i++){
      if(all_users[i].name==user_id.trim()){
        user = all_users[i];
        break;
      }
    }
    callback(user);
  }
}

exports.updateVillain = function(villain_id, updated_param, info) {
  var villain = exports.getVillain(villain_id);
  villain[updated_param] = info;
  exports.updateVillainCSV(villain);
  return villain;
}

exports.updateVillainCSV = function(updated_villain) {
  var all_villains = dataJS.loadCSV("data/villains.csv");
  for(var i=1; i<all_villains.length; i++){
    if(all_villains[i].name==updated_villain.name) {
      all_villains[i] = updated_villain;
      break;
    }
  }
  dataJS.uploadCSV(all_villains, "data/villains.csv");
  return all_villains;
}
//calculates the villain's choice of weapon based on the inputs and the villain's possible strategies
exports.villainStrategies = function(villain,villainPrevious,userPrevious,userCurrent){
    var rand=Math.random();
    var choice=exports.randomChoice();
    switch(villain){
        case "Bones":
            if (rand>0.5)
                return choice;
            else
                return villainPrevious;
        case "Comic_Hans":
            if (rand>0.7)
                return choice;
            else
                return loseAgainst(userCurrent)
        case "Gato":
            return choice;
        case "Harry":
            return choice;
        case "Manny":
            return choice;
        case "Mickey":
            if(rand>0.6)
                return loseAgainst(villainPrevious);
            else
                return choice;
        case "Mr_Modern":
            if(rand>0.7)
                return "rock";
            else
                return choice;
        case "Pixie":
            return loseAgainst(userPrevious);
        case "Regal":
            if (rand>0.4)
                return winAgainst(userPrevious);
            else
                return winAgainst(userCurrent);
        case "The_Boss":
            return winAgainst(userCurrent);
        case "The_Magician":
            return choice;
        case "Spock":
            return choice;
    }
}
function winAgainst(weapon){
    switch(weapon){
        case "rock":
            return "paper";
        case "paper":
            return "scissors";
        case "scissors":
            return "rock";
        /*default:
            return "Mjölnir"*/
    }
}
function loseAgainst(weapon){
  switch(weapon){
      case "rock":
          return "scissors";
      case "paper":
          return "rock";
      case "scissors":
          return "paper";
  }
}
function randomChoice(){
    var choices=["rock","paper","scissors"];
    return choices[(3*Math.random())|0];
}

exports.winAgainst = function(weapon){
    return winAgainst(weapon);
}
exports.loseAgainst = function(weapon){
  return loseAgainst(weapon);
}
exports.randomChoice = function(){
    return randomChoice();
}
