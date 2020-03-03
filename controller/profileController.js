var express=require('express');
var router=express.Router();
var connectionController = express();
var session = require('express-session');
var UserProfile = require('../models/userProfile');
var Connection = require('../models/connection');
var connectionDB = require('../utility/connectionDB');
var UserConnection = require('../models/userConnection')
var userDB = require('../utility/userDB');
var userConnectionDB = require('../utility/userConnectionDB');

var crypto = require('crypto');
var bodyParser= require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended :false});
var { check, validationResult } = require('express-validator');
var userProfile;
router.use( (req, res, next) => {
 res.locals.user = req.session.theUser;
 next();
});
// login signout session functionality
router.get('/login',function(req,res){
  res.render('login',{session:undefined,valid:false,error:undefined});
});

// user login functionality
router.post('/login',urlencodedParser,[
  check('emailAddress').isEmail().withMessage('username must be a email'),
  check('password').isLength({ min: 8, max: 20})
  .withMessage('Password must be between 8-20 characters long.')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
  .withMessage('Password must include lowercase,uppercase,number & special character.')
], async function(req,res){
   var errors =validationResult(req);
   if(!errors.isEmpty()){
     res.render('login',{valid:false,error:errors.array(),session:req.session.theUser})
   }else if(!req.session.theUser){
    var email_id = req.body.emailAddress;
    var password = req.body.password;

    //saltHash Password
    var session = await userDB.getUserProfile(email_id,password);

    if(session != null && session.password == saltHashPassword(password,session.salt)){

      req.session.theUser = session;
      userProfile = new UserProfile(session);
      var userConnections = await userProfile.userConnections_add(session.userID);
      userProfile.UserConsList= userConnections;
    //  console.log(userProfile);
      req.session.userProfile = userProfile;
      res.render('savedConnections',{data:req.session.userProfile,session:req.session.theUser});
    }else{
      res.render('login',{valid:true,error:null,session:undefined});
    }
  }else{
    res.render('savedConnections',{data:req.session.userProfile,session:req.session.theUser});
  }
});

//user logout functionality
      router.get('/signout',function(req,res){
        if(req.session.theUser){
          userProfile.emptyProfile();
          req.session.destroy();
          res.redirect('/');
        }else{
           res.redirect('/');
        }
       });
router.post('/savedConnections',urlencodedParser,async function(req,res){
  if(req.body.action== undefined){
    res.render('savedConnections',{data:req.session.userProfile,session:req.session.theUser});
  }else if(req.session.theUser == undefined){
    res.render('index',{session:req.session.theUser});
  }else{
      var action = req.body.action;
      console.log(action);
      var connectionId = req.query.connectionID;
      var rsvp = req.query.rsvp;
      console.log(connectionId);
      var connection = await connectionDB.getConnection(connectionId);
      var ExistsCheck = 0;
      var deleteCheck = 0;
//checks form action and adds new connection if the connection doesn't exists
      if(action == 'save'){
        for(var i=0; i< userProfile.UserConsList.length; i++ ){
          if(userProfile.UserConsList[i].Connection.connectionID === connectionId){
            ExistsCheck = 1;
          }
        }
        console.log(ExistsCheck);
        if(ExistsCheck == 0){
          await  userProfile.addConnection(connection[0],rsvp);
          var userConns = await userProfile.userConnections_add(req.session.theUser.userID);
          userProfile.UserConsList= userConns;
          req.session.userProfile = userProfile;
          res.render('savedConnections',{data:req.session.userProfile,session:req.session.theUser});
        }else{
          var  userconnection = UserConnection.UserConnection(connection[0],rsvp);
        await userProfile.updateConnection(userconnection);
        var userConns = await userProfile.userConnections_add(req.session.theUser.userID);
        userProfile.UserConsList= userConns;
          req.session.userProfile = userProfile;
          console.log(req.session.userProfile );
          res.render('savedConnections',{data:req.session.userProfile,session:req.session.theUser});
        }
//checks form action, if its delete, then remove the connection
      }else if(action == 'DELETE'){
          for(var i=0; i< userProfile.UserConsList.length; i++ ){
            if(userProfile.UserConsList[i].Connection.connectionID === connectionId){
              deleteCheck = 1;
            }
          }
        if(deleteCheck == 1){
          await userProfile.removeConnection(connection[0]);
          var userConns = await userProfile.userConnections_add(req.session.theUser.userID);
          userProfile.UserConsList= userConns;
          req.session.userProfile = userProfile;
          res.render('savedConnections',{data:req.session.userProfile,session:req.session.theUser});
        }else{
          res.render('savedConnections',{data:req.session.userProfile,session:req.session.theUser});
        }
      }
    }
  });

  router.get('/signup',function(req,res){
   res.render('signup',{session:req.session.theUser,error:undefined});
  });

  router.post('/signup',urlencodedParser,[
    check('userid').isLength({ min: 5}).withMessage('UserId must be length of 5'),
    check('fname').matches( /^[a-zA-Z ]*$/).withMessage('FirstName must be in alphabets'),
    check('lname').matches(/^[a-zA-Z ]*$/).withMessage('LastName must be in alphabets'),
    check('email').isEmail().withMessage('Enter valid Email'),
    check('password').isLength({ min: 8, max: 20})
    .withMessage('Password must be between 8-20 characters long.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
    .withMessage('Password must include lowercase,uppercase,number & special character.')
   ],async function(req,res){

     var errors =validationResult(req);
     if(!errors.isEmpty()){
       res.render('signup',{error:errors.array(),session:undefined})
     }else{
       var salt = getSalt();
       var hashPassword =saltHashPassword(req.body.password,salt);
       var session = await userDB.new_User(req.body,hashPassword,salt);
       req.session.theUser = session;
       userProfile = new UserProfile(session);
       userProfile.UserConsList= [];
       req.session.userProfile = userProfile;
       res.render('savedConnections',{data:req.session.userProfile,session:req.session.theUser});
   }
  });

  router.get('/update',async function(req,res){
    var connectionId = req.query.connectionID;
    var result = await connectionDB.getConnection(connectionId);
    res.render('updateConnection',{session:req.session.theUser,result:result,error:undefined})
  })

  router.post('/update',urlencodedParser,[
    check('topic').matches(/^[a-z0-9 ]+$/i).withMessage('topic must be alphabets'),
    check('name').isLength({ min: 3}).withMessage('name must atleast have length of 3'),
    check('details').isLength({ min: 10}).withMessage('details must be length of 10'),
    check('location').isLength({min:5}).withMessage('where must be length of 5'),
    check('about').isLength({min:20}).withMessage('about must be length of 10 words'),
    check('time').matches(/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))+$/i).withMessage('Invalid time format'),
    check('date').matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).withMessage('Invalid Date format yyyy/mm/dd'),
  ],async function(req,res){
    console.log("hi");
    var session = req.session.theUser;
    if(session != null){
      await connectionDB.update_newConnec(session.userID,req.body);
      res.redirect('/connections');
    }
  })

  router.post('/delete',urlencodedParser,async function(req,res){
    var session = req.session.theUser;
    var connectionId = req.query.connectionID;
    if(session != null && connectionId !=null ){
      await connectionDB.delete_newConnec(connectionId,session.userID);
      await userConnectionDB.removeConnection(connectionId);
      var userConnections = await userProfile.userConnections_add(session.userID);
      userProfile.UserConsList= userConnections;
      req.session.userProfile = userProfile;
      res.redirect('/connections');
    }
  })
//function to create hashPassword
  function saltHashPassword(password,salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var hashPassword = hash.digest('hex');
    return hashPassword;
  }
  function getSalt(){
    var salt = crypto.randomBytes(8).toString('hex') .slice(0,16);
    console.log(salt);
    return salt;
  }

  router.get('/*',function(req,res){
      res.send('ERROR 400!!! Invalid URL');
  });

module.exports = router;
