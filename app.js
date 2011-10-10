
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

userData = [
	{ firstname: "admin", username: "admin", password: "admin" }
];

var loginform = require("express-form")

//function to validate user subscription entry
function validateSub(uname, udata){
  var ret = true
  for(var i = 0; i < udata.length; i++){
      if(uname == udata[i].username)
        ret = false
      }
  return ret;
}

//function to check if entries exists
function filled(a, b, c){
  var expr = /^[0-9a-zA-Z]+$/;
  if( a.match(expr) && b.match(expr) && c.match(expr) )
    return true;
  else
    return false;
}
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  //app.set("view engine", "html");
  app.register(".html", require("jqtpl").express);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  //jade
  res.render('index', {title: 'WebDev MiniProject',});
  //html
  //res.render('layout', {variable: {name: 'Hello anonymous, Welcome.'}});    

});

app.get('/loginPage', function(req, res){
  
  res.render('loginPage', {title: 'WebDev MiniProject',});  

});

app.get('/signupPage', function(req, res){
  
  res.render('signupPage', {title: 'WebDev MiniProject',});  

});

app.post(
  '/loginValidation',
  function(req, res){
    for(var i = 0; i < userData.length; i++){
      if(req.body.uname == userData[i].username && req.body.pass == userData[i].password){
        res.render('loginsuccessPage', {title: 'WebDev MiniProject', firstname: userData[i].firstname}); 
        }
      else
        res.render('loginfailPage', {title: 'WebDev MiniProject'});
    }         
  }
);

app.post(
  '/signupValidation',
  function(req, res){
    if(filled(req.body.fname, req.body.uname, req.body.pass)){
      if(validateSub(req.body.uname, userData)){    
        userData.push({ firstname: req.body.fname, username: req.body.uname, password: req.body.pass });
        res.render('signupsuccessPage', {title: 'WebDev MiniProject'});
      }
      else
        res.render('signupfailPage', {title: 'WebDev MiniProject', username: req.body.uname});
    }
    else 
      res.render('signupfail2Page', {title: 'WebDev MiniProject'});
  }         
);



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
