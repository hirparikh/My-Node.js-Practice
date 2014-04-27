
/*
 * GET home page.
 */
var url = require("url");
exports.Duplicatefound = function(req, res){
	var query = url.parse(req.url).query;
  	res.render('Duplicateuser', { title: query });
};