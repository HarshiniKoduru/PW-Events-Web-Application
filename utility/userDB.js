var User = require('../models/user');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/PW_EVENTS', {useNewUrlParser: true});
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userID: {type:String, required:true},
  firstName: {type:String, required:true},
  lastName: {type:String, required:true},
  emailAddress: {type:String, required:true},
  password:{type:String, required:true},
  addressLine1:String,
  addressLine2:String,
  city:String,
  state:String,
  postalCode:String,
  country:String,
  salt:{type:String, required:true}
});
var user_Model = mongoose.model('users', userSchema);

function getUsers(){
  return new Promise(resolve =>{
        resolve(user_Model.find({}).then(function(users){
          return users;
        })
      );
    });
}

function getUserProfile(email_id,password){
  console.log(email_id);
  console.log(password);
  return new Promise(resolve =>{
        resolve(user_Model.findOne({emailAddress:email_id}).then(function(user){
          console.log(user);
          return user;
        })
      );
    });

}

function getUser(userID){
  return new Promise(resolve =>{
        resolve(user_Model.find({userID:userID}).then(function(user){

          return user;
        })
      );
    });
}

function new_User(user,password,salt){
  var addUser = {"userID":user.userid,"firstName":user.fname,"lastName":user.lname,"emailAddress":user.email,"addressLine1":user.address1Field,
                 "addressLine2":user.address2Field,"city":user.city,"state":user.state,"postalCode":user.postcode,"country":user.country,
                "password":password,"salt":salt};
  return new Promise(resolve =>{
        resolve(user_Model.collection.insertOne(addUser).then(function(data){
          return addUser;
        })
      );
    });
}


module.exports= {"getUsers":getUsers, "getUser":getUser,"getUserProfile":getUserProfile,"new_User":new_User};
