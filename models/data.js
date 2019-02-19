var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1DVgMG20OgfLR0leaJvzOiHDxp19EoyGKHTJxUCnxoX0');
// Authenticate with the Google Spreadsheets API.

exports.loadGoogle = function(filename, callback) {
  var user_data = [];
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(filename, function (err, rows) {
      callback(rows);
    });
  });
}


//CSV stuff---------------------------------
var fs = require("fs");

exports.loadCSV =function(filename) {
  var users_file = fs.readFileSync(filename, "utf8");
  //console.log(users_file);
  var rows = users_file.split('\n');
  var user_data = [];
  for(var i = 0; i < rows.length; i++) {
      var user_d = rows[i].trim().split(",");
      var user = {};
      if (filename == "data/users.csv") {
        user.name = user_d[0];
        user.pswd = user_d[1];
        user.total_games = parseInt(user_d[2]);
        user.wins = parseInt(user_d[3]);
        user.losses = parseInt(user_d[4]);
        user.rock = parseFloat(user_d[5]);
        user.paper = parseFloat(user_d[6]);
        user.scissors = parseFloat(user_d[7]);
        user.first_name=user_d[8];
        user.last_name=user_d[9];
        user_data.push(user);
      } else if (filename == "data/villains.csv") {
        user.name = user_d[0];
        user.total_games = parseInt(user_d[1]);
        user.wins = parseInt(user_d[2]);
        user.losses = parseInt(user_d[3]);
        user.rock = parseFloat(user_d[4]);
        user.paper = parseFloat(user_d[5]);
        user.scissors = parseFloat(user_d[6]);
        user_data.push(user);
      }
  }
  return user_data;
}

//uploads the csv containing all the gameplay data (used to update villains.csv and users.csv)


exports.updateCell=function(GoogleSpreadsheet, userName, columnToUpdate, newValue){
    GoogleSpreadsheet.getCells({
      'min-col': 1,
      'max-col': 2,
      'return-empty': true
    }, function(1,err, cells) {
        for(var i=0; i<cells.length;i++){
            if(cells[i].trim()==userName.trim()){
                
            sheet.getRows({
      offset: 1,
      limit: 20,
      orderby: 'col2'
    }, function(1,err, rows ){
                
                
                
            }
                
                
                
                
                
                
                
            }
                 
            }
        }
    });
}
exports.uploadCSV =function(user_data, file_name) {
  var out="";
  user_data.sort(function(a,b) {
    var bPercent = 0;
    if (b.total_games == 0) {
      bPercent = 0;
    } else {
      bPercent =Math.round((b.wins/b.total_games)*100);
    }
    var aPercent = 0;
    if (a.total_games == 0) {
      aPercent = 0;
    } else {
      aPercent =Math.round((a.wins/a.total_games)*100);
    }
    return (bPercent-aPercent);
  });
  for (var i = 0; i < user_data.length; i++) {
    arr=Object.keys(user_data[i]);
    for (var k=0;k<arr.length;k++){
      if(k == arr.length-1) {
        out+=user_data[i][arr[k]];
      } else {
        out+=user_data[i][arr[k]]+",";
      }
    }
    if (i!=user_data.length-1){
        out+="\n";
    }

  }
  fs.writeFileSync(file_name, out, "utf8")
}
