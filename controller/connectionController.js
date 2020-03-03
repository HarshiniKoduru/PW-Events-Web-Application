var express=require('express');
var router=express.Router();
var session = require('express-session');
var connectionDB= require('../utility/connectionDB');
var userConnectionDB = require('../utility/userConnectionDB');
var bodyParser= require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var { check, validationResult } = require('express-validator');
router.get('/',function(req,res){
  res.render('index',{session:req.session.theUser});
});
router.get('/index',function(req,res){
  res.render('index',{session:req.session.theUser});
});

router.get('/connection',async function(req,res){
  var con_Id = req.query.connectionID;
  console.log(con_Id);
  var user = req.session.theUser;
  if(con_Id !== undefined && con_Id !== null){
	  var result = await connectionDB.getConnection(con_Id);
    if(result != null && user !=null && result.length != 0 && result[0].userID ==user.userID){
		  res.render('connection',{result:result,session:user,modify:true});
	  }else if(result != null  && result.length != 0 ){

    res.render('connection',{result:result,session:user,modify:false});
    console.log("hello2");
    }
    else{
		  res.send('No connections are available at this point');

	  }
  }else{
    var connections = await connectionDB.getConnections();
    var connTopics = await connectionDB.getConnectionTopic();
     res.render('connections',{data:connections,connTopics:connTopics,session:req.session.theUser});
  }
});
router.get('/connections',async function(req,res){
  var connTopics = await connectionDB.getConnectionTopic();
var data = await connectionDB.getConnections();
//console.log(data);
  res.render('connections',{data:data, connTopics:connTopics,session:req.session.theUser});
//  console.log(connTopics);
});

router.get('/savedConnections',function(req,res){
  res.render('savedConnections',{data:req.session.userProfile,session:req.session.theUser});
});

router.get('/newConnection',function(req,res){
  res.render('newConnection',{session:req.session.theUser,error:undefined,notlogin:false});
});

router.post('/newConnection',urlEncodedParser,[
  check('connectionID').matches(/^[a-z0-9 ]+$/i).withMessage('ID must be length 5'),
  check('topic').matches(/^[a-z0-9 ]+$/i).withMessage('topic must be alphabets'),
  check('name').isLength({ min: 3}).withMessage('name must atleast have length of 3'),
  check('details').isLength({ min: 10}).withMessage('details must be length of 10'),
  check('location').isLength({min:5}).withMessage('where must be length of 5'),
  check('about').isLength({min:20}).withMessage('about must be length of 10 words'),
  check('date', "Date should be today or ahead of today's date").isAfter()], async function(req,res){
   var errors =validationResult(req);
   var user = req.session.theUser;
  if(!errors.isEmpty()){
    console.log(errors);
    res.render('newConnection',{session:req.session.theUser,error:errors.array(),notlogin:false})
  }else if(user == null ){
     res.render('newConnection',{session:req.session.theUser,error:null,notlogin:true})
  }else{
    console.log("hi")
    var user=req.session.theUser;
  await userConnectionDB.addConnection(req.body,user);
   res.redirect('/connections');
}
});

router.get('/about',function(req,res){
  res.render('about',{session:req.session.theUser});
});
router.get('/newConnection',function(req,res){
  res.render('newConnection',{session:req.session.theUser});
});
router.get('/contact',function(req,res){
  res.render('contact',{session:req.session.theUser});
});
module.exports = router;
