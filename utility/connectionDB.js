var Connection = require('./../models/Connection');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/PW_EVENTS', {useNewUrlParser: true});
var db = mongoose.connection;
var Schema = mongoose.Schema;

// var engagement = con_Model.connection('FM1','Engagement Party','Falcy weds Marshal','This is our first rodeo as future Mr. & Mrs, so put your cowboy boots and hat on and round up with us for a backyard BBQ party','Hosted by Falcy and marshal \n Venue at 220 BARTON CREEK DRIVE!','09.21.2019','11:30 AM','As the joy of engagement sneaks upon us, We are inviting you all for the engagement ceremony. Other parties will follow quickly!','../assets/images/engage.jpg');
// var bridal_shower = con_Model.connection('FM2','Bridal Shower','Falcy weds Marshal','Celebrate love with a shower that pays homage to the city of light and love. Witness the decorations and serve up French wines, cheeses, and desserts inspired by paris theme.','Hosted by Falcy and marshal \n venue at 24th  North Tryon street','09.22.2019','5:30 pm','Its about the bride, and there is no one quite like her. We are marking the special day and her bright future by planning a fête','../assets/images/bridal.jpg');
// var wedding = con_Model.connection('FM3','Wedding Cermony','Falcy weds Marshal','Hurray! Our wedding theme is RUSTIC!! interesting right? Come and join with us for the wedding. Wedding gonna take place in village halls','Hosted by Falcy and marshal \n Venue at 220 BARTON CREEK DRIVE!','09.23.2019','10:00 AM','Wedding day is one of the most important and extraordinary days of our life; Come and witness the festive and enjoyable wedding.','../assets/images/mr.jpg');
// var guest_speech = con_Model.connection('BL1','Guest Speech','Book Launch Event','An opening speech by our chief guest. He shares his experiences in the writting field and how he had overcome problems.','Hosted by Harshini Koduru, Organized by PW Events \n Speech at Auditorium 3A','12.12.2019','9:30 Am','Our Event begins with our Chief guest speech.As he explains the hurdles he faced and some tips for writing a great novel','../assets/images/guest.jpg');
// var author_talk = con_Model.connection('BL2','Author Talk','Book Launch Event','Know the story behind writting HOLIDAY HOURS in the words of the author Harshini Koduru.','Hosted by Harshini Koduru, Organized by PW Events \n Venue at the Auditorium 4B which next to refreshments hall','12.12.2019','10:30 AM','Attend the Author talk with our Harshini Koduru and know more about her new novel "HOLIDAY HOURS"','../assets/images/holiday.jpg');
// var book_sign = con_Model.connection('BL3','Book Signing Session','Book Launch Event','After the event, please drop in for the book signing event and get the first autograph.','Hosted by Harshini Koduru, Organized by PW Events \n Venue near Elevator','12.12.2019','12:00 PM','After the event, please drop in for the book signing event and get the first autograph.','../assets/images/signing.jpg');

var conn_Schema =  new Schema({
  connectionID: {type:String, required:true},
  userID:{type:String, required:true},
  connectionName: {type:String, required:true},
  connectionTopic: {type:String, required:true},
  details: {type:String, required:true},
  location: {type:String, required:true},
  date: {type:String, required:true},
  time: String,
  about_event: String,
  image_url: String
});
var conn_Model = mongoose.model('connections', conn_Schema);


 function getConnections() {
  return  new Promise(resolve =>{
        resolve(conn_Model.find().then(function(connections){
          return connections;
        })
      );
    });
};

 function getConnection(connectionID){
   return new Promise(resolve =>{
     resolve(conn_Model.find({"connectionID":connectionID}).then(function(connection){
          return connection;
        })
      );
    });
}

function getConnectionTopic(){
  return new Promise(resolve =>{
        resolve(conn_Model.distinct("connectionTopic").then(function(topics){
          return topics;
        })
      );
    });
}

function update_newConnec(userID,connection){
  var update_connection = {"connectionID":connection.connectionID,"userID":userID,"connectionName":connection.name,"connectionTopic":connection.topic,"details":connection.details,"location":connection.location,"date":connection.date,"time":connection.time,"about_event":connection.about_event,"image_url":connection.imageurl};
  return new Promise(resolve =>{
       resolve(conn_Model.updateOne({connectionID:connection.connectionID, userID:userID},update_connection).then(function(data){
       return data;
        })
      );
    });
}

function delete_newConnec(connectionID,userID){
  return new Promise(resolve =>{
        resolve(conn_Model.deleteOne({connectionID:connectionID, userID:userID}).then(function(data){
          return data;
        })
      );
    });
}

module.exports={
  getConnections:getConnections,
  getConnection:getConnection,
  getConnectionTopic:getConnectionTopic,
  update_newConnec:update_newConnec,
  delete_newConnec:delete_newConnec
}
