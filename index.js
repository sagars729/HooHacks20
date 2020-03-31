#!/usr/bin/nodejs

// -------------- load packages -------------- //
var express = require('express');
var app = express();
var path = require('path');
var hbs = require( 'express-handlebars' )//require('hbs');
var cookieSession = require('cookie-session')
const sgMail = require('@sendgrid/mail');
const { MongoClient } = require('mongodb');

sgMail.setApiKey('SG.YP5pBZoESoexi0rFM5KYEg.PP97oVi5RByg5qkSehkPHyEAZnzPszwhPhpewzjOBGw');
const uri = "mongodb+srv://Hackers:HooHacks@hoohacks2020-czgp0.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect();

// distinct past dates
async function past(client){
    var pastDates = await client.db("covid").collection("locations").distinct("Date");
	console.log(pastDates)
    return pastDates;
}

// distinct future dates
async function future(client){
    var futureDates = await client.db("covid").collection("predictions").distinct("Date");
    return futureDates;
}

// data given a day that has passed
async function dataOfPast(client, day){
    var dataPast = await client.db("covid").collection("locations").find({Date: day}).toArray();
    return dataPast;
}

// data given a day that has passed
async function dataOfFuture(client, day){
    var dataFuture = await client.db("covid").collection("predictions").find({Date: day}).toArray();
    return dataFuture;
}

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

app.get('/covid_dates', function(req, res) {
	past(client).then(pst => {
		future(client).then(fut => {
		
			var response = {
				response: 200,
				past: pst,
				pred: fut
			}

			res.send(response)
		});
	});
});

app.get('/covid_data', function(req,res){
	var date = req.query.date;
	
	dataOfPast(client, date).then(pst => {
		dataOfFuture(client,date).then(fut => {
			var response = {
				response: 200,
				past: pst,
				pred: fut
			}

			res.send(response)

		});
	});
});

app.get('/covid_email', function(req,res){
    var name = req.query.name;
	var cases = req.query.cases;
	var date = req.query.date;
	var beds = req.query.beds;
	var vents = req.query.vents;
	var email = req.query.email;

	var emSubject, emText;
	emSubject = 'COVID-19 Report for location: '+ name;
	emText = 'This is an update on COVID-19 at '+ name +
		     '\n On Date' + date +
         '\n'+'The number of Cases Reported are: ' + cases +
         '\n'+'The Number of Ventilators needed are: '+ vents + 
         '\n'+'The Number of Beds needed are: '+ beds; 
	
	console.log(emText)
	console.log(req.query)

	const msg = {
  		to: email,
 		from: 'hitnuke@gmail.com',
  		subject: emSubject,
  		text: emText,
  		html: emText,
	};
	sgMail.send(msg);

    var response = {
        response: 200,
		data: req.query
    }
    res.send(response)
});
// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 
app.get('/:page',function(req,res){
	console.log("Error Page Not Found");
});

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});
