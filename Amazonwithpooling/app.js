
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var reg = require('./routes/register');
var login = require('./routes/login');
var ins = require('./routes/insertsuccess');
var Duplicate = require('./routes/DuplicateUser');
var Connectionpooling = require('./Connectionpooling');
var catins = require('./routes/insertcatalog');
var proins = require('./routes/insertproduct');
var usecrt = require('./routes/usercart');
var userpruchase = require('./routes/orderdetails');
var main = require('./routes/main');
var http = require('http');
var path = require('path');
var ejs = require("ejs");

var app = express();
var request = require("request");
var mysql = require("./mysql_connect");

// all environments
app.use(express.cookieParser());
app.use(express.session({secret: 'cmpe273'}));
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/home', routes.index);
app.get('/', main.loadsite);
app.get('/users', user.list);
app.get('/register', reg.register);
app.get('/login', login.trytologin);
app.get('/duplicateUser', Duplicate.Duplicatefound);
app.get('/insertcatalog', catins.catinsert);
app.get('/insertproduct',proins.proinsert);
app.get('/usercart',usecrt.getcart);
app.get('/orderdetails',userpruchase.getpurchase);

http.createServer(app).listen(app.get('port'), function(){
   Connectionpooling.makeconnections();
  console.log('Express server listening on port ' + app.get('port'));
});

app.post('/addToCart', function(req, res) {
	console.log(req.body.data);

	var productId = req.body.productId.replace('""','');
	console.log('proid : ' + productId);
	//var input_quantity = req.body.input_no_of_products.replace('""','');

	mysql.addProductsToCart(function(err,result)
	{		
		console.log('insert Catalog');
		if(err){
			console.log('Error occured');
			throw err;
		}		
		else{
			console.log('Back to index');
		}
	},req.session.uid,productId); 
	res.send(req.body);
	
});


app.post('/insert', function (req, res) {
	if(!req.body.hasOwnProperty('firstname') ||!req.body.hasOwnProperty('lastname')||!req.body.hasOwnProperty('EmailId')||!req.body.hasOwnProperty('password')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	mysql.insertAndQuery(function(err,results){
		console.log("Inside callback");
		if(err){
			res.redirect("/duplicateUser?" + req.param('EmailId') );
			
			//throw err;
		}else{
			 //app.get('/insert', ins.insertsuccess);

			res.render('successInsert',
					{result : 'Success'},
					function(err, result) {
						console.log("Rendered");
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
	},req.param('firstname'),req.param('lastname'),req.param('EmailId'),req.param('password'));
	
});


app.post('/newcatalog', function (req, res) {
	if(!req.body.hasOwnProperty('catname') ) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	mysql.insertcatQuery(function(err,results){
		console.log("Inside callback");
		if(err){
			res.end('Catalog name already exists.');
			//alert('Catalog name already exists.');
			//throw err;
		}else{
			 
	res.end('Catalog successfully inserted.');
			//alert('Catalog successfully inserted.');
		}
	},req.param('catname'));
	
});


app.post('/newproduct', function (req, res) {
	if(!req.body.hasOwnProperty('productCatlog') || !req.body.hasOwnProperty('proname') || !req.body.hasOwnProperty('prodesc') || !req.body.hasOwnProperty('proprice') || !req.body.hasOwnProperty('proqty')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	mysql.insertproductQuery(function(err,results){
		console.log("Inside callback");
		if(err){
			res.end('Product name already exists.');
			//alert('Catalog name already exists.');
			//throw err;
		}else{
			 
	res.end('Product successfully inserted.');
			//alert('Catalog successfully inserted.');
		}
	},req.param('productCatlog'),req.param('proname'),req.param('prodesc'),req.param('proprice'),req.param('proqty'));
	
});



app.post('/procedetoorder', function (req, res) {
	
	var usid= req.session.uid;
	
	mysql.insertOrderQuery(function(err,results){
		console.log("Inside callback");
		if(err){
			res.end('Product name already exists in order.');
			
		}else{
			 
			//res.end('Product successfully inserted.');
			res.redirect("/orderdetails");
		}
	},usid);
	
});


app.post('/checklogin', function (req, res) {
	if(!req.body.hasOwnProperty('userName') ||!req.body.hasOwnProperty('password')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	mysql.checkLogInData(function(err,results){
		if(err){
			throw err;
		}else{
			console.log(results.length);
			if(results.length>0)
			{

				req.session.uid= results[0].userid;
				req.session.uname= results[0].firstname;
				req.session.admin = results[0].IsAdmin;
				req.session.lasttimelog = results[0].Lastlogin;
				console.log("hellooo      : " +req.session.uid + "-- " + results[0].firstname +"--" + req.session.lasttimelog);
				res.redirect("/home");
			}
			
			
		}
	},req.param('userName'),req.param('password'));
	
});
