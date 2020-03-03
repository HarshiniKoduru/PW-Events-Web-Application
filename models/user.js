var user  = function(UserId, fName, lName, emailId,adline1, adline2, city, state, postal, country){
var user_Model = {userId:UserId, firstName:fName, lastName:lName, emailAddress:emailId,addressLine1:adline1, addressLine2:adline2, city:city, state:state, postalCode:postal, country:country};
return user_Model;
};
module.exports.user = user;
