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

//Connecting to the MongoDB server
mongoose.connect(config.dbURL,function(error){
    if(error){
        console.log('Attempted DB Connection has failed');
    }
     else console.log ('Successfully connected to Database');   
});

//setting up the secret key for hashing the JSON web tokens
app.set('superSecret',config.secret);

//configuring the required middlewares
app.use(bodyParser.urlencoded({extended :false}));
app.use(bodyParser.json());
app.use(morgan('combined'));

//creating the model on the Database if the connection is successful
var User = mongoose.model('userDataBank',userSchema);

//Intializing the express application
app.use('/api',apiRoutes);
app.listen(port);

//server is started
console.log('Server has been started on Port :- ' + port);

//route ./
app.get('/',function (request,response){
    response.send('Please re-drirect to ./api/welcome to get the route documentation');
});

//route ./api/
apiRoutes.get('/',function (request,response){
    response.send('Please re-drirect to ./api/welcome to get the route documentation');
});

//route ./api/welcome
apiRoutes.get('/welcome', function(request,response){
   var responseJSON = {
       welcome : '/api/welcome',
       getallusers : '/api/users',
       setupsuperAdmin : '/api/setupsuperadmin',
       login : '/api/login',
       createUser : '/api/createuser'
   };
   response.json(responseJSON);
});

//route ./api/setupsuperadmin
apiRoutes.get('/setupsuperadmin',function(request,response){
    var firstUser= new User({
        name : 'root',
        password : 'root',
        admin : true
    });
    firstUser.save(function(error){
        if(!error)
        {
           console.log('The root user has been setup with admin privileges');
           response.send('The root user has been setup with admin privileges');
        }
        else console.log('Creation of root user has failed');
    });
});

//route ./api/users
apiRoutes.get('/users',function(request,response){
    User.find({},function(error, users) {
    console.log('users are found');
    response.json(users);
    });
});

//route ./api/login
apiRoutes.post( '/login',function(request,response) {
    var isLoginSuccess = false;
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

//route ./api/createuser
apiRoutes.post('/createuser',function createUserCallback(request,response){
    var responseJSON;
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    if(token){
        //decode and verify token
        jwt.verify(token, app.get('superSecret'), function(error,decoded){
            //if verificition is successful then
            if(error){
                console.log('Failed to decode the Token');
                responseJSON = {
                    success : false,
                    error : error,
                    message : 'Wrong or empty token has been provided'
                };//close responseJSON
                response.json(responseJSON);
                
            }//end inner if block 
            else {
            //create user if token has been provided
            responseJSON = createNewUser(request);
            response.send('Check the Database for the new user');
            }//end inner else block 
        });
    }
});

//function to create new user if the logged in user has role admin
var createNewUser = function(request){
    var adminJSON;
    var responseJSON;
    User.findOne({name : request.body.name},function(error,user){
        if(error) { 
           adminJSON = { message : 'Entered userid is not yet created.'};//end JSON object
                  }  
        else {
            if(user.password === request.body.password){
            if(user.admin){
                console.log('Admin user has logged');
                adminJSON = {message : 'Admin found,User created'};
                var createdUser = new User({
                                    name : request.body.newName,
                                    password : request.body.newPassword,
                                    admin : request.body.newAdmin
    });// end creating new user from the request
                //attempt made to save the user
                createdUser.save(function(error){
                             if(!error)
                                 {
                                    console.log('User has been created successfuly');
                                    responseJSON = { admin : adminJSON }; //response JSON Object
                                  }
                              else console.log('Attempt to create the user has failed.Please check');
                              });
            }//ending if conditon
          else { console.log('Current User does not have Admin Privileges');}   
        } else { console.log('Entered Credentials are wrong.');} //end else block here
        } //end outermost else block
    });
    return responseJSON; //the cooked response is returned.
    }


  

