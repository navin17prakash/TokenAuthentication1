//database connection URL
var dbURL= 'mongodb://navinprakash:123456@ds037415.mongolab.com:37415/mnotes';
//Key for hashing the JSON web tokens
var secret = 'radiantnavin';
//name of the model against which the collections will be created on the 
var modelName = 'userDataBank';

module.exports.secret = secret;
module.exports.dbURL =dbURL;
module.exports.modelName = modelName;

