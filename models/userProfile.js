var connectionDB= require('../utility/connectionDB')
var UserConnection = require('./userConnection');
var Connection = require('./connection');
var userConnectionDB=require('../utility/userConnectionDB')
let UserProfile = class {
  constructor(UserID) {
    this.UserID=UserID;
    this.UserConsList=[];
  }

//method to add a new connection in saved connections page
async addConnection(connection,rsvp){
var add_user = await userConnectionDB.addRSVP(connection.connectionID,this.UserID.userID,rsvp);
}


  //method to remove connection from saved connections page
  async removeConnection(connection){
   await userConnectionDB.deleteConnection(connection.connectionID,this.UserID.userID);
  }

  //method to update connection information
  async updateConnection(userConnection){
   await userConnectionDB.updateRSVP(userConnection.Connection.connectionID,this.UserID.userID,userConnection.rsvp);
  }

  async userConnections_add(userId){
   var UserConsList =[];
   console.log(userId);
   var userConns = await userConnectionDB.getUserProfile(userId);
   console.log(userConns);
   for(var item=0 ; item< userConns.length; item++){
     var connection = await connectionDB.getConnection(userConns[item].connectionID);
     var rsvp = userConns[item].rsvp;
     var userConn = UserConnection.UserConnection(connection[0],rsvp);
    UserConsList.push(userConn);
  }
   return UserConsList;
 }

  getConnections() {
    return this.UserConsList;
}

  getConnection(connectionId)
  {
  var connection;
  if(this.UserConsList[i].Connection.connectionID === connectionId){
    connection = this.UserConsList[i].Connection;
  }
  return connection
  }

//method to remove all users
  emptyProfile()
  {
    this.UserConsList=[];
    this.UserID=null;
  }
}
module.exports=UserProfile;
