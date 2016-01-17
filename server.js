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


apiRoutes.get('/setuprootuser',function(request,response){
    var firstUser= new User({
        name : 'navinprakash',
        password : 'indiaindia',
        admin : true
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

apiRoutes.get('/allusers',function(request,response){
    console.log('Getting all the users');
    console.log(request.body);
    console.log('value sent is' + request.body.navin);
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
                var token =jwt.sign(user,app.get('superSecret'),{expiresIn : 86400});
                var responseJSON ={
                    name : request.body.name,
                    token : token,
                    message : 'sending token'
                }
                response.send(responseJSON);
            }
        }
        })
});
apiRoutes.post('/createuser',function createUserCallback(request,response){
    var isTokenVerfied=false;
    var responseJSON;
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    if(token){
        //decode and verify token
        jwt.verify(token, app.get('superSecret'), function(error,decoded){
            //if verificition is successful then
            console.log('value of error is' + error);
            if(error){
                console.log('Failed to decode the Token');
                responseJSON = {
                    success : false,
                    message : 'Wrong or empty token has been provided'
                };//close responseJSON
                isTokenVerfied = false;
                response.json(responseJSON);
                
            }//emd inner if block 
            else {
            isTokenVerfied =true;
            //create user if token has been provided
            responseJSON = gappu(isTokenVerfied,request);
            response.json(responseJSON);
            }//end inner else block 
        });
    }
    
    
});
var gappu = function(isTokenVerified,request){
    console.log('am called');
    var adminJSON;
    var responseJSON;
    console.log('creating user by navin');
    User.findOne({name : request.body.name},function(error,user){
        if(error) { adminJSON = { message : 'Credential entered is wrong'};
                    
                  }
        else {
            if(user.admin){
                console.log('admin user has logged');
                adminJSON = {message : 'Admin found,User created'};
                console.log('trying hard');
                var createdUser = new User({
                                    name : request.body.newName,
                                    password : request.body.newPassword,
                                    admin : request.body.newAdmin
    });
                createdUser.save(function(error){
                             if(!error)
                                 {
                                    console.log('1 user has been saved successfully');
                                    responseJSON = { 
                    admin : adminJSON
    };
    
    
                                   }
                                else console.log('save has failed');
                              });
            } //end admin checking
         else { console.log('Not logged as an admin');}   
        } //end findone else
        
    });
    return responseJSON;
    }


app.use('/api',apiRoutes);  

