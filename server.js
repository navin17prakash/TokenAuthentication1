var mongoose =require('mongoose');
var express = require ('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config.js');
var model = require('./model.js');
var userSchema = model.userModel;
var app =express();
var port = 8080;

var apiRoutes = express.Router();

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
var User = mongoose.model('userDataBank',userSchema);
console.log(Object.keys(apiRoutes));
app.listen(port);
console.log('listening on' + port);
console.log('value of supersecret is' + app.get('superSecret'));


app.get('/setup',function(request,response){
    var firstUser= new User({
        name : 'navin',
        password : 'indiaindia',
        admin : false
    });
    firstUser.save(function(error){
        if(! error)
        {
            console.log('1 user has been saved successfully');
           response.send('1 user has been saved successfully');
        }
        else console.log('save has failed');
    });
});

apiRoutes.get('/users',function(request,response){
    User.find({},function(error, users) {
    console.log('users are found');
    response.json(users);
    });
    
});
app.use('/api',apiRoutes);

