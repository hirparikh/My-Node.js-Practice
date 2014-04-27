
/*
 * GET home page.
 */
var mysql = require("../mysql_connect");
var url = require("url");
exports.index = function(req, res){
	var query = url.parse(req.url).query;
	var usid,usname,Isadmin,lasttime;
	if(req.session.uid && req.session.uname){
		usid = req.session.uid;
		usname = req.session.uname;
	}
	else{
		usname = "";
		usid = "";
	}
	if(req.session.admin){
		Isadmin = req.session.admin;
	} 
	else{
		Isadmin = "";
	}
	if(req.session.lasttimelog){
		lasttime = req.session.lasttimelog;
	} 
	else{
		lasttime = "";
	}
				

	if(query !=undefined && query !=""){
		mysql.fetchcatalogandproduct(function(err,catresult,proresult){
			if(err != 1)
			{
				res.statusCode = 400;
			return res.send('Error 400: Post syntax incorrect.Error in fetching catalog andproduct');
			}
			else
			{
				console.log("catalogdata : "+JSON.stringify(catresult));
				console.log("productdata : "+JSON.stringify(proresult));
				console.log("productlength : "+ proresult.length);
				res.render('index', { Admin: Isadmin,lastlog : lasttime, catalog : catresult,products : proresult,userid: usid,username: usname });
			}

		},query);
	}
	else{
		mysql.fetchcatalog(function(result){
			// if(err)
			// {
			// 	res.statusCode = 400;
			// return res.send('Error 400: Post syntax incorrect.Error in fetching catalog');
			// }
			// else
			// {
				res.render('index', { Admin: Isadmin,lastlog : lasttime, catalog : result,userid: usid,username: usname });
			//}

		});
	}

	

 // res.render('index', { title: 'Amazon' });
};