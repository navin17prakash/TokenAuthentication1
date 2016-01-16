var mongoose =require('mongoose');
var express = require ('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

var config = require('./config.js');
var User = require('./model.js');

var app =express();
var port = 8080;

app.get('/sample', function(request,response){
   response.send("hello this is sample");
    
});

app.listen(port);
console.log('listening on' + port);

mongoose.connect(config.dbURL,function(error){
    if(error){
        console.log('Attempted DB Connection has failed');
    }
     else console.log ('Successfully connected to Database');   
});