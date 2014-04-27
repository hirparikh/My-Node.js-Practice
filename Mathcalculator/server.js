/**
 * New node file
 */
var http = require("http");
var url = require("url");

function start(route,handle)
{
	function hello(request,response){
		
		var  path = url.parse(request.url).pathname;
		var  postdata = url.parse(request.url).query;
		
		console.log('Request for path name - ' + path + ' received.');
		console.log('Request for query - ' + postdata + ' received.');
		request.setEncoding("utf8");
		
		route(handle,path,response,postdata);
		
		
	
	}

	http.createServer(hello).listen(1500);
	console.log('Server running at http://127.0.0.1:1500/');
}

exports.start = start;