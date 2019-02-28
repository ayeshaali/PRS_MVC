var fs = require("fs");
var dataJS = require(__dirname +'/data');
var userJS = require(__dirname +'/User');

//gets a villain
exports.getVillain = function(villain_id, callback) {
  dataJS.log("getVillain: "+villain_id);
  var user;
  dataJS.loadGoogle(2, function(all_users) {
    for(var i=0; i<all_users.length; i++){
      if(all_users[i].name==villain_id.trim()){
        user = all_users[i];
        break;
      }
    }
    callback(user);
  });
}

//updates a villain's data
exports.updateVillain = function(villain_id, updates, callback) {
  dataJS.log("updateVillain: "+villain_id);
  dataJS.updateRow(1, villain_id, updates, callback)
}

//changes the villains' colors
exports.changeColors = function(){
  var svgNames=["the_boss","the_magician","harry","gato","bones","manny","comic_hans","mickey","pixie","regal","spock","mr_modern"];
  var colors=["red","blue","green","white","olive","yellow","orange","purple", "navy", "gray", "fuchsia", "lime"];
  var svgExtensions=["_waiting","_rock","_scissors","_paper"];
  var tempColors=colors.slice(0);
  for (var k=0;k<svgNames.length;k++){
    var index =Math.floor(Math.random()*tempColors.length);
    chosenColor=tempColors[index];
    for (var j=0; j<svgExtensions.length;j++){
      svgName="./public/images/"+svgNames[k]+svgExtensions[j]+".svg";
      if(!svgName.includes("regal_waiting")){
        var svgToEdit=fs.readFileSync(svgName, "utf8");
        var out=svgToEdit.split("fill");
        var output=out[0];
        for(var i=1;i<out.length;i++){
          output+="fill:"+chosenColor+out[i].substring(out[i].indexOf('"'),out[i].length);
        }
        fs.writeFileSync(svgName,output, "utf8");
      } else {
        var svgToEdit=fs.readFileSync(svgName, "utf8");
        var out=svgToEdit.split("stroke:");
        var output=out[0];
        //dataJS.log(out);
        for(var i=1;i<out.length;i++){
          output+="stroke:"+chosenColor+out[i].substring(out[i].indexOf('"'),out[i].length);
        }
        fs.writeFileSync(svgName,output, "utf8");
      }
    }
    tempColors.splice(index,1)
  }
}


//calculates the villain's choice of weapon based on the inputs and the villain's possible strategies
exports.villainStrategies = function(villain,villainPrevious,userPrevious,userCurrent){
    dataJS.log("villainStrategies: "+villain_id);
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
