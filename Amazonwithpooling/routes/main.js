var url = require("url");
exports.loadsite = function(req, res){
	var query = url.parse(req.url).query;
	req.session.destroy();
  	res.render('main', { title: query });
};