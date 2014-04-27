
/*
 * GET home page.
 */
var url = require("url");
exports.catinsert = function(req, res){
	var query = url.parse(req.url).query;
  	res.render('insertcatalog', { title: query });
};