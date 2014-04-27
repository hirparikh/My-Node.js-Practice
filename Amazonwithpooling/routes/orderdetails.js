var url = require("url");
var mysql = require("../mysql_connect");
exports.getpurchase = function(req, res,total){
	var query = url.parse(req.url).query;
	var usid,usname,Isadmin;
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

	mysql.fetchorderdata(function(err,result,total){
			if(err)
			{
				res.statusCode = 400;
			return res.send('Error 400: Post syntax incorrect.Error in fetching catalog');
			}
			else
			{
				console.log('total = '+ JSON.stringify(total));
				res.render('orderdetails', { Admin: Isadmin, cartdata : result,userid: usid,username: usname,totalcharge: total });
			}

		},usid);

};