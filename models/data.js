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

exports.updateCell=function(filename, userName, newStuff, callback){
  var sheet;
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getInfo(function(err,info){
      sheet=info.worksheets[filename];
      sheet.getCells({
        'min-col': 1,
        'max-col': 1,
        'return-empty': true}, function(err, cells) {
        for(var i=0; i<cells.length;i++){
          if(cells[i].value==userName){
            sheet.getCells({'min-row': i+1,'max-row': i+1}, 
            function(err, cells) {
              for(var i=0; i<cells.length;i++){   
                cells[i].setValue(newStuff[i]);                    
              }
            });  
            break;                       
          }  
        }
        callback();
      });
    });
  });
}

exports.createRow = function(obj, callback) {
  var sheet;
  doc.useServiceAccountAuth(creds, function (err) {
    doc.addRow(1, obj, function(){ 
      console.log("Calling first callback")
      callback();
    });
  });
}

