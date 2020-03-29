#!/usr/bin/nodejs

// -------------- load packages -------------- //
var express = require('express');
var app = express();
var path = require('path');
var hbs = require( 'express-handlebars' )//require('hbs');
var cookieSession = require('cookie-session')
// -------------- express initialization -------------- //

app.set('port', process.env.PORT || 8080 );
app.engine( 'hbs', hbs( { 
  extname: 'hbs', 
  partialsDir: path.join(__dirname, 'views', 'partials'),
} ) );
app.set('view engine', 'hbs');

//cookies//
app.set('trust proxy', 1) // trust first proxy 

app.use(cookieSession({
  name: 'cookieSession',
  keys: ['TheseWillBe123', 'Replaced456']
}))


// -------------- serve static folders -------------- //
app.use('/home/js', express.static(path.join(__dirname, 'js')))
app.use('/home/css', express.static(path.join(__dirname, 'css')))
app.use('/covid/css', express.static(path.join(__dirname, 'Website','css')))
app.use('/covid/js', express.static(path.join(__dirname, 'Website','js')))

// -------------- express 'get' handlers -------------- //
app.get('/', function(req, res){
    res.redirect('/covid')//.render(path.join(__dirname,'index.hbs'),{'profile':req.session.profile});
});

// -------------- Landing Page -------------- //
app.get('/covid', function(req,res){
	console.log("Going To Website");
    res.render(path.join(__dirname,'Website','index.hbs')); 
});

// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 
app.get('/:page',function(req,res){
	console.log("Error Page Not Found");
});

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});
