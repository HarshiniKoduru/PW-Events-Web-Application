var connection  = function(connection_Id, connection_Name,connection_topic,details,location,date,time,about_event,image_url){
var con_Model = {connectionID:connection_Id, connectionName:connection_Name,connectionTopic:connection_topic,details:details,location:location,date:date,time:time,about_event:about_event,image_url:image_url};
return con_Model;
};
module.exports.connection = connection;
