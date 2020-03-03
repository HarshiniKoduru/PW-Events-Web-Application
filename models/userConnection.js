var UserConnection = function(connection,rsvp){
  var user_model = {Connection:connection,rsvp:rsvp};
  return user_model;
};
module.exports.UserConnection=UserConnection
