var mongoose =require('mongoose');
var express = require ('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config.js');
var User = require('./model.js');

var app =express();
var port = 8080;

mongoose.connect(config.dbURL,function(error){
    if(error){
        console.log('Attempted DB Connection has failed');
    }
     else console.log ('Successfully connected to Database');   
});

app.set('superSecret',config.secret);
app.use(bodyParser.urlencoded({extended :false}));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.get('/sample', function(request,response){
   response.send("hello this is sample");
    
});

app.listen(port);
console.log('listening on' + port);
console.log('value of supersecret is' + app.get('superSecret'));


