var timer = require('timer-jobs');
var mysql = require('mysql');

var availableconnections = [];
var sizeofarray;

var Schedular = new timer({interval: 1000}, function(done) {
    if(availableconnections.length > (sizeofarray* 0.8)){
    	removefromconnection();
	 }
	 if (availableconnections.length <4) {
	 	addmoretoconnection();
	 }

});
Schedular.start();



function makeconnections(){
	for (var i = 0 ;i< 10; i++)
	{
		var con = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : '1202',
			port: '3306',
			database: 'amazon'
		});
		availableconnections.push(con);
	}
	sizeofarray = 10;
}

function addmoretoconnection(){
	for(var i=0;i<sizeofarray;i++){
		var con = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : '1202',
			port: '3306',
			database: 'amazon'
		});
		availableconnections.push(con);
	}
	sizeofarray = sizeofarray * 2;
}

function removefromconnection(){
	// if(availableconnections.length > (sizeofarray* 0.8)){

	// }
	for(var i =0;availableconnections.length/2;i++){
		var con = availableconnections.pop();
		con = null;
	}
}

function getconnection(){
	var con = availableconnections.pop();
	return con;
}

function backtoconnection(con){
	availableconnections.push(con);
}


exports.backtoconnection = backtoconnection;
exports.getconnection = getconnection;
exports.removefromconnection = removefromconnection;
exports.addmoretoconnection = addmoretoconnection;
exports.makeconnections = makeconnections;

