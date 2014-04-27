
function route(handle,path,response,postdata)
{
	console.log('About to route a request for : ' + path);
	if(typeof handle[path]=== 'function')
	{
		return handle[path](response,postdata);
		
	}
	else
	{
			console.log("no request handler found for "+ path);
			response.writeHead(404,{"Content-Type":"text/plain"});
			response.write("404 not found");
			response.end();
			
	}
}

exports.route = route;