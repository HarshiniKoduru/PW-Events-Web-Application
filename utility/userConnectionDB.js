// require the connection model from models start

var connectionDB=require('../utility/connectionDB')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/PW_EVENTS', {useNewUrlParser: true});
var db = mongoose.connection;
var Schema = mongoose.Schema;
var userConnSchema = new Schema({
  userID: {type:String, required:true},
  connectionID: {type:String, required:true},
  rsvp:{type:String, required:true},
});


var userConnModel = mongoose.model('userConnections', userConnSchema);
var conn_Model = mongoose.model('connections',connectionDB.conn_Schema)

function getUserProfile(userID){
  return new Promise(resolve =>{
    console.log(userID);
        resolve(userConnModel.find({userID:userID}).then(function(userConns){
         console.log(userConns);
          return userConns;
        })
      );
    });
}

function addRSVP(connectionId, userID, rsvp,connection){
  var userConn = {"userID":userID,"connectionID":connectionId,"rsvp":rsvp};
  return new Promise(resolve =>{
        resolve(userConnModel.collection.insertOne(userConn).then(function(info){
          return info;
        })
      );
    });
}

function updateRSVP(connectionId, userID, rsvp){
  var userConnection = {"userID":userID,"connectionID":connectionId,"rsvp":rsvp};
  return new Promise(resolve =>{
        resolve(userConnModel.updateOne({connectionID:connectionId, userID:userID},userConnection).then(function(info){
          return info;
        })
      );
    });
}

function deleteConnection(connectionId, userID){
  return new Promise(resolve =>{
        resolve(userConnModel.deleteOne({connectionID:connectionId, userID:userID}).then(function(data){
          return data;
        })
      );
    });
}


function addConnection(connection,user){
  var defaultimageurl = "../assets/Images/pw.jpg"
  var Conn_new = {"userID":user.userID,"connectionID":connection.connectionID,"connectionName":connection.name,"connectionTopic":connection.topic,"details":connection.details,"location":connection.location,"date":connection.date,"time":connection.time,"about_event":connection.about,"image_url":defaultimageurl};
  return new Promise(resolve =>{
        resolve(conn_Model.collection.insertOne(Conn_new).then(function(info){
          return info;
        })
      );
    });
}

function removeConnection(connectionID){
  return new Promise(resolve =>{
        resolve(userConnModel.deleteMany({connectionID:connectionID}).then(function(data){
          return data;
        })
      );
    });
}


module.exports= {
  getUserProfile:getUserProfile,
  addRSVP:addRSVP,
  updateRSVP:updateRSVP,
  deleteConnection:deleteConnection,
  addConnection:addConnection,
  removeConnection:removeConnection,
};
