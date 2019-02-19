var fs = require("fs");
var dataJS = require(__dirname +'/data');
var villainJS = require(__dirname +'/Villain');

exports.getUser = function(user_id, callback) {
  console.log("Users.getUser: "+user_id);
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

exports.createUser = function(user_id, user_password,first_name,last_name) {
    if (user_id==null||user_id==""||first_name==null||first_name==""||last_name==null||last_name==""||user_password==null||user_password==""){
        console.log("inv");
        return false;
    }
    dataJS.createRow(1, user_id, user_password,first_name,last_name)
    return true;
}

exports.deleteUser = function(user_id) {
  var all_users = dataJS.loadCSV("data/users.csv");
  var index;
  for(var i=1; i<all_users.length; i++){
    if(all_users[i].name==user_id.trim()){
      index = i;
    }
  }
  all_users.splice(index,1);
  dataJS.uploadCSV(all_users, "data/users.csv");
}

exports.updateUser = function(user_id, updated_param, new_info) {
  dataJS.updateCell(user_id, updated_param+1, new_info);
}

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
        //console.log(out);
        for(var i=1;i<out.length;i++){
          output+="stroke:"+chosenColor+out[i].substring(out[i].indexOf('"'),out[i].length);
        }
        fs.writeFileSync(svgName,output, "utf8");
      }
    }
    tempColors.splice(index,1)
  }
}

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
