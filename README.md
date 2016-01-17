#Name and Author
Simple Token based authentication system by -Navin Prakash. navin17prakash@gmail.com

#Description
This Node project demonstrates the capablities of Token Based authentication system.This is been completely developed using JavaScript.
This is Node.JS based platoform utilizing Express Applicaion Framework, Body Parser Middleware and Mongoose as the driver for connecting to the Datavase.
This uses MongoDB.
The npm module morgan has been used to log the requets on the console for development purpose.

#Configuration File

Following information needs to be provided on the configuration file.
1. Database Connection String.
2. Secret key for hashing of the web tokens generated.
3. Name of the database model agaisnt which all the documents will be stored.

#ROUTES Defined.

       welcome : '/api/welcome' - To display all the api routes.
       getallusers : '/api/users' - To display all the users in the Database.
       setupsuperAdmin : '/api/setupsuperadmin', - To setup the root user
       
       >Following routes provide the Token on successful Login
       
       login : '/api/login', - Login functionality using a valid user name and password.Token is sent as a response.
       Paramerters : name, password
       --This is post API. Parameters are provided as x-www-form-urlencoded
       
       >Following api is needs to be authenticated by providing a valid JSON web token
       createUser : '/api/createuser'- To create a user if the user is logged in as a admin
       Parameters name,password,token,newName,newPassword,newAdmin,token
       Note-newAdmin is boolean. Provide 'true' if the news user has be provided admin role.
       --This is post API. Parameters are provided as x-www-form-urlencoded
       
#Thanks
#Contact Info
    email -navinprakash.in@live.com,navin17prakash@gmail.com