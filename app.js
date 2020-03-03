var express =require('express');

var app = express();
var session = require('express-session');
var path = require('path');
var viewPath = path.join(__dirname, './views');
app.set('view engine', 'ejs');
app.set('views', viewPath);
app.use('/assets', express.static('assests'));
app.use('/assets/CSS',express.static(path.join(__dirname,'/./assets/CSS')));
app.use('/assets/Images',express.static(path.join(__dirname,'/./assets/Images')));
app.use(session({secret: 'mile stone 9-6'}));
var connectionController = require('./controller/connectionController.js');
var profileController = require('./controller/profileController.js');
app.use('/',connectionController);
app.use('/',profileController);
app.listen(8095);
