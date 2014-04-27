/**
 * New node file
 */

var dbConfiguration = {
		host     : 'localhost',
		user     : 'root',
		password : '1202',
		port: '3306',
		database: 'amazon'
		};

var Connectionpooling = require('./Connectionpooling');
var mysql      = require('mysql');

var catalogcache = null;


function insertcatQuery(callback,catname){

console.log("Catalogname: " + catname);
// var connection = mysql.createConnection(dbConfiguration);
	 
// 	connection.connect();

var connection = Connectionpooling.getconnection();
	var sql = 'INSERT INTO catalogs (catName) VALUES ("'+ catname + '")';
	console.log(sql);
	connection.query(sql, function(err, results) {
		if (err) {
			
            console.log("ERROR: " + err.message);
            Connectionpooling.backtoconnection(connection);
            callback(err, results);
        }
        else
        {
        	console.log("Data inserted, going to notify caller");
        	var sqlcacheupdate = 'select catId as id,catName as name from catalogs;';
			connection.query(sqlcacheupdate, function(errcache, rows){
				if(errcache){
					
					console.log(errcache.message);
					
				}
				else{
					catalogcache = rows;
					Connectionpooling.backtoconnection(connection);
					callback(err, results);
				}
		});
        	
        	
        }
			 
	});
}

function insertproductQuery(callback,catname,proname,prodesc,proprice,proqty){

console.log("Catalogname: " + catname + ", product : "+ proname +", description "+ prodesc + ", price: "  + proprice+", quantity: "+ proqty);
 // 	var connection = mysql.createConnection(dbConfiguration); 
	// connection.connect();
	var connection = Connectionpooling.getconnection();
	var sql = 'INSERT INTO products (name,productdescription,productprice,totqty,catalogId) VALUES ("'+ proname + '","'+ prodesc +'","'+ proprice +'","'+proqty+'","'+ catname +'")';
	console.log(sql);
	connection.query(sql, function(err, results) {
		if (err) {
			
            console.log("ERROR: " + err.message);
            Connectionpooling.backtoconnection(connection);
            callback(err, results);
        }
        else
        {
        	console.log("Data inserted, going to notify caller");
        	Connectionpooling.backtoconnection(connection);
        	callback(err, results);
        	console.log(results);	
        }
			 
	});
}

function addProductsToCart(callback,uId,proId){
	
	console.log("userID: " + uId + "prductid: " + proId );
	// var connection = mysql.createConnection(dbConfiguration);
	 
	// connection.connect();
	var connection = Connectionpooling.getconnection();
	var sql = 'select idproducts as proid,productprice,totqty  from products where idproducts = '+ proId +' and totqty > 0;';

	//var sql = 'INSERT INTO userdetail (firstname,lastname,emailid,password) VALUES ("'+ fname + '","' + lname + '","' + email + '","' + password + '")';
	console.log(sql);
	connection.query(sql, function(err, results) {
		if (err) {
			
            console.log("ERROR: " + err.message);
            callback(err, results);
        }
        else{
        	var proprice = results[0].productprice;
        	var proavailable = results[0].totqty;

        	var sqlcat = 'select cartId,cartqty,carttotalcharge from cartdetails where productId = '+ proId +' and userId = ' + uId +' ;' ;

        	connection.query(sqlcat, function(errcat, rows, fields){
						if (errcat) {
							//callback(err,catalogdata,rowsprodust);
							console.log("error in get cat :" + errcat.message);
						}
						else{
							proavailable = proavailable -1;
							var sqlupdateproduct = 'update products set totqty = '+ proavailable +' where idproducts= '+ proId +';' 
							

							if(rows.length!==0){
								var catcharge = rows[0].carttotalcharge;
        						var cartquantity = rows[0].cartqty;
        						var cartupId = rows[0].cartId;

        						cartquantity = cartquantity + 1;        					
        						catcharge = proprice * cartquantity;

        						var sqlupdatecart = 'update cartdetails set cartqty = '+ cartquantity +' , carttotalcharge = '+ catcharge +' where cartId = '+ cartupId +' ;'
        						console.log(sqlupdatecart);
        						connection.query(sqlupdatecart, function(errinscat, rowsrows){
									if (errinscat) {
										//callback(err,catalogdata,rowsprodust);
										console.log("error in up cat :" + errinscat.message);
									}
									else
									{
										connection.query(sqlupdateproduct, function(erruppro, resuppro){
											if (erruppro) {
												//callback(err,catalogdata,rowsprodust);
												console.log("error in pro1 :" + erruppro.message);
											}
											else
											{
												Connectionpooling.backtoconnection(connection);
												callback(erruppro,resuppro);
											}
										});
									}
								});
							}
							else{
								var catcharge = proprice;
        						var cartquantity = 1;
        						

        						var sqlupdatecart = 'insert into cartdetails (userId,productId,cartqty,carttotalcharge) '
        						+'values ('+ uId +','+ proId +','+ cartquantity +','+ catcharge +')  ;'

        						connection.query(sqlupdatecart, function(errinscat, rowsrows){
									if (errinscat) {
										//callback(err,catalogdata,rowsprodust);
										console.log("error in ins cat :" + errinscat.message);
									}
									else
									{
										connection.query(sqlupdateproduct, function(erruppro, resuppro){
											if (erruppro) {
												//callback(err,catalogdata,rowsprodust);
												console.log("error in pro2 :" + erruppro.message);
											}
											else
											{
												Connectionpooling.backtoconnection(connection);
												callback(erruppro,resuppro);
											}
										});
									}
								});
        						
							}


						}
			});
        }

    });
        	
}

function insertAndQuery(callback,fname,lname,email,password){

console.log("Firstname: " + fname + "Lastname: " + lname + "EmailId: " + email);
// var connection = mysql.createConnection(dbConfiguration);
	 
// 	connection.connect();
var connection = Connectionpooling.getconnection();
	var sql = 'INSERT INTO userdetail (firstname,lastname,emailid,password) VALUES ("'+ fname + '","' + lname + '","' + email + '","' + password + '")';
	console.log(sql);
	connection.query(sql, function(err, results) {
		if (err) {
			
            console.log("ERROR: " + err.message);
            Connectionpooling.backtoconnection(connection);
            callback(err, results);
        }
        else
        {
        	console.log("Data inserted, going to notify caller");
        	callback(err, results);
        	Connectionpooling.backtoconnection(connection);
        	console.log(results);	
        }
		
//		sql = 'SELECT * FROM USER';
//		connection.query(sql, function(err, rows, fields){
//				if(rows.length!==0){
//					console.log("DATA: " + rows[0].data.toString());
//				}
//		});
		 
	});
}

function fetchData(callback,userName,password){
	
	console.log("USERNAME: " + userName + "Password: " + password);
	// var connection = mysql.createConnection(dbConfiguration);
		 
	// 	connection.connect();
	var connection = Connectionpooling.getconnection();
		var sql = 'SELECT * FROM PERSON';
		connection.query(sql, function(err, rows, fields){
				if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					Connectionpooling.backtoconnection(connection);
					callback(err, rows);
				}
		});
}


function fetchcatalog(callback){
	
	
		// var connection = mysql.createConnection(dbConfiguration);
		 
		// connection.connect();	
		if (catalogcache != null) {
			//console.log(catalogcache);
			callback(catalogcache);
		}
		else{
			var connection = Connectionpooling.getconnection();
			var sql = 'select catId as id,catName as name from catalogs;';
			connection.query(sql, function(err, rows, fields){
				if(rows.length!==0){
					console.log("DATA : "+JSON.stringify(rows));
					Connectionpooling.backtoconnection(connection);
					catalogcache = rows;
					callback( rows);
					
				}
		});
		}
		
}


function fetchcartdata(callback,catuId){
	
	
	
	// var connection = mysql.createConnection(dbConfiguration);
		 
	// 	connection.connect();
	var connection = Connectionpooling.getconnection();

		var sql = 'select cd.*,pd.name,pd.productprice from cartdetails cd LEFT JOIN products pd ON pd.idproducts = cd.productId where cd.userId = '+ catuId +';';


		
		connection.query(sql, function(err, rowsprodust, fields){

				if (err) {
					//callback(err,catalogdata,rowsprodust);
					console.log("error in pro :" + err.message);
				}
				else{

					var sqlcat = 'select sum(cd.carttotalcharge) as total from cartdetails cd LEFT JOIN products pd ON pd.idproducts = cd.productId where cd.userId = '+ catuId+';';
						connection.query(sqlcat, function(errcat, rows, fields){
						if (errcat) {
							//callback(err,catalogdata,rowsprodust);
							console.log("error in cart :" + errcat.message);
						}
						else
						{
							
							Connectionpooling.backtoconnection(connection);
							callback(err,rowsprodust,rows);
						}
					});	

				}

		});


}


function fetchorderdata(callback,orduId){
	
	
	
	// var connection = mysql.createConnection(dbConfiguration);
		 
	// 	connection.connect();
	var connection = Connectionpooling.getconnection();

		var sql = 'select cd.*,pd.name,pd.productprice from orderdetails cd LEFT JOIN products pd ON pd.idproducts = cd.productId where cd.userId = '+ orduId +';';


		
		connection.query(sql, function(err, rowsprodust, fields){

				if (err) {
					//callback(err,catalogdata,rowsprodust);
					console.log("error in pro :" + err.message);
				}
				else{

					var sqlcat = 'select sum(cd.totalcharge) as total from orderdetails cd LEFT JOIN products pd ON pd.idproducts = cd.productId where cd.userId = '+ orduId+';';
						connection.query(sqlcat, function(errcat, rows, fields){
						if (errcat) {
							//callback(err,catalogdata,rowsprodust);
							console.log("error in cart :" + errcat.message);
						}
						else
						{
							
							Connectionpooling.backtoconnection(connection);
							callback(err,rowsprodust,rows);
						}
					});	

				}

		});


}


function insertOrderQuery(callback,userid){

	var connection = Connectionpooling.getconnection();

	var sqlgetcat = 'select * from cartdetails where userId = '+ userid +';';
	connection.query(sqlgetcat, function(err, rowscat, fields){

				if (err) {
					//callback(err,catalogdata,rowsprodust);
					console.log("error in pro :" + err.message);
				}
				else{
					if(rowscat.length > 0 )
					{
						for(var i=0;i<rowscat.length;i++){
							var sqlorder = 'insert into orderdetails (userId,productId,orqty,totalcharge) values'
							+' ('+ rowscat[i].userId +','+ rowscat[i].productId +','+ rowscat[i].cartqty +','+ rowscat[i].carttotalcharge +') ;';
							connection.query(sqlorder, function(err, resultinsorder){
								if(err){
									console.log('Error in insert order:  ' + err.message);
								}
							});

						}

						 var sqldltcart = 'delete from cartdetails where userId ='+  userid+';';
						 connection.query(sqldltcart, function(err, resultdltcart){
								if(err){
									console.log('Error in insert order:  ' + err.message);
								}
								else{
									Connectionpooling.backtoconnection(connection);
									callback(err,resultdltcart);
								}
							});
					}
				}
			});
}


function fetchcatalogandproduct(callback,procatcatid){
	
	var catalogdata={},productdata={},error;
	
	// var connection = mysql.createConnection(dbConfiguration);
		 
	// 	connection.connect();

	var connection = Connectionpooling.getconnection();
		

		var sql = 'select idproducts as proid,name as proname,productdescription as prodesc,productprice,totqty,'
		+ 'CatalogId as catname from products where CatalogId = '+ procatcatid +' and totqty > 0;';
		connection.query(sql, function(err, rowsprodust, fields){

				if (err) {
					//callback(err,catalogdata,rowsprodust);
					console.log("error in pro :" + err.message);
				}
				else{

					var sqlcat = 'select catId as id,catName as name from catalogs;';
						connection.query(sqlcat, function(errcat, rows, fields){
						if (errcat) {
							//callback(err,catalogdata,rowsprodust);
							console.log("error in cat :" + errcat.message);
						}
						else
						{
							Connectionpooling.backtoconnection(connection);
							callback(1,rows,rowsprodust);
						}
					});	

				}

				// if(rows.length!==0){
				// 	console.log("DATA : "+JSON.stringify(rows));
				// 	productdata = rows;
				// 	//callback(err, rows);
				// }
		});


		
}


function checkLogInData(callback,userName,password){
	
	console.log("USERNAME: " + userName + "Password: " + password);
	//var connection = mysql.createConnection(dbConfiguration);
	var connection = Connectionpooling.getconnection();
	console.log(connection);
		//connection.connect();
		var sql = 'SELECT * FROM userdetail where emailid= "' + userName + '" and password = "' + password + '"';
		console.log(sql);
		connection.query(sql, function(err, resultlog){
			// console.log(rows);
			console.log("ROWS PRESENT --> " + resultlog.length);
				if(resultlog.length!==0){
					//if (rows[0].count > 0) {
						console.log("DATA : "+JSON.stringify(resultlog));
						// var now = new Date();
						
						// var usid = resultlog[0].userId;
						//now = now.substring(0,25);
						

						var sqlupdatetime = 'update userdetail set Lastlogin = Now() where 	emailid= "' + userName + '" ;';
                      

						console.log(sqlupdatetime);

						connection.query(sqlupdatetime, function(errtime, upresults){
							if(err){
								console.log("Error : "+ errtime.message );
							}
							else{
								Connectionpooling.backtoconnection(connection);
								callback(err, resultlog);		
							}
						});

						
					};
					
				//}
		});
}


exports.checkLogInData = checkLogInData;
exports.insertAndQuery = insertAndQuery;
exports.fetchData = fetchData;
exports.fetchcatalog = fetchcatalog;
exports.fetchcatalogandproduct = fetchcatalogandproduct;
exports.insertproductQuery = insertproductQuery;
exports.insertcatQuery = insertcatQuery;
exports.addProductsToCart = addProductsToCart;
exports.fetchcartdata = fetchcartdata;
exports.insertOrderQuery = insertOrderQuery;
exports.fetchorderdata = fetchorderdata;