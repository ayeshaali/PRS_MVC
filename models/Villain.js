var fs = require("fs");
var dataJS = require(__dirname +'/data');
var userJS = require(__dirname +'/User');

//calculates the villain's choice of weapon based on the inputs and the villain's possible strategies

exports.villainStrategies = function(villain,villainPrevious,userPrevious,userCurrent){
    var rand=Math.random();
    var choice=randomChoice();
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

//returns the weapon that defeats the input weapon
exports.winAgainst = function(weapon){
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

exports.loseAgainst = function(weapon){
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
