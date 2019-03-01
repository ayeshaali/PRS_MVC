var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
var dataJS = require(__dirname +'/data');
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

//Updates a row
exports.updateRow=function(filename, userName, newStuff, callback){
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
        console.log("doing callback");
        callback();
      });
    });
  });
}

// creates a new row (when making a new user)
exports.createRow = function(obj, callback) {
  var sheet;
  doc.useServiceAccountAuth(creds, function (err) {
    doc.addRow(1, obj, function(){
      dataJS.log("Calling first callback")
      callback();
    });
  });
}

// deletes a row (when deleting a user)
exports.deleteRow = function(user_id, callback) {
  var sheet;
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getInfo(function(err,info){
      sheet=info.worksheets[0];
      sheet.getCells({
        'min-col': 1,
        'max-col': 1,
        'return-empty': true}, function(err, cells) {
        for(var i=0; i<cells.length;i++){
          if(cells[i].value==user_id){
            var index = i;
             sheet.getRows(function (err, rows) {
               rows[i-1].del(function(err){
                 callback();
               });
            });
            break;
          }
        }
      });
    });
  });
}

exports.log=function(message){
    console.log(message);
    doc.useServiceAccountAuth(creds, function (err) {
        doc.getInfo(function(err,info){
    sheet=info.worksheets[2];
      sheet.getCells({
        'min-col': 1,
        'max-col': 1,
        'return-empty': true}, function(err, cells) {
          go=true;
          i=0;
        while (go){
            var a="";
            try{a=cells[i].value}catch(ErrorEvent){}
            if(a==""){
          cells[i].setValue(JSON.stringify(message));
                go=false;
            }else{
            i++;
            }
        }
      });
      });
  });
}

exports.increment=function(page){
    arr=["index","game","results","rules","stats","about","userDetails"];
    num=arr.indexOf(page)+4;
    doc.useServiceAccountAuth(creds, function (err) {
        doc.getInfo(function(err,info){
        sheet=info.worksheets[2];
      sheet.getCells({
        'min-col': num,
        'max-col': num,
        'return-empty': true}, function(err, cells) {
            var a=0;
            try{a=parseInt(cells[1].value)}catch(ErrorEvent){}
            if(a==0){
          cells[1].setValue(1);
            }else{
            cells[1].setValue(a+1);
            }
      });
      });
  });
}

exports.loadUsage=function(callback){
    arr=[0,0,0,0,0,0,0];
    doc.useServiceAccountAuth(creds, function (err) {
        doc.getInfo(function(err,info){
        sheet=info.worksheets[2];
            
        sheet.getCells({
        'min-row':2,
        'min-col': 4,
        'max-col': 10,
        'max-row':2,
        'return-empty': true}, function(err, cells) {
            for(var i=0; i<7;i++){
            arr[i]=parseInt(cells[i].value);
            }
            callback(arr);  
      });
            
      });
         
  });
   
}
