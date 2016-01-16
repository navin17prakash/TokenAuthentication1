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
apiRoutes.get('/',function (request,response){
    response.send('use the proper api routes');
});


apiRoutes.get('/users',function(request,response){
    User.find({},function(error, users) {
    console.log('users are found');
    response.json(users);
    });
    
});

apiRoutes.post('/createuser',function(request,response){
    console.log('post api is hit ');
    console.log(request.body);
    console.log('value sent is' + request.body.navin);
    //console.log(request.body.navin1);
    
});

apiRoutes.post( '/login',function(request,response) {
     var isLoginSuccess = false;
    console.log('attempting login');
    User.findOne({
        name : request.body.name
    },function(error,user){
        if(error)
        {
            response.send('Login has failed.Please enter a valid user name and passord');
        }
        else {
            if(user.password === request.body.password)
            {
                isLoginSuccess =true;
                console.log('login performed by'+ request.body.name);
            }
        }
        })
});

app.use('/api',apiRoutes);

