var mongoose =require('mongoose');
var express = require ('express');
var app =express();
var port = 8080;

app.get('/sample', function(request,response){
   response.send("hello this is sample")
    
});

app.listen(port);
console.log('listening on' + port);

