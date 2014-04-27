
/*
 * GET home page.
 */
var url = require("url");
var mysql = require("../mysql_connect");
exports.proinsert = function(req, res){
	var query = url.parse(req.url).query;

	mysql.fetchcatalog(function(result){
		// if(err)
		// {
		// 	res.statusCode = 400;
		// return res.send('Error 400: Post syntax incorrect.Error in fetching catalog');
		// }
		// else
		// {
			res.render('insertproduct', { catalog : result });
		//}

	});

  	
};