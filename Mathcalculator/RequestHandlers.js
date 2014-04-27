/**
 * New node file
 */
var querystring = require("querystring"),
fs = require("fs");





function checkprime(response,postdata)
{
	console.log('checkprime handler');
	var data = "";
	var num = postdata.substring(postdata.indexOf("=") + 1);
	
	data = validateno(num);
	
	if(data === "")
	{
		data = num + " is " + (isPrime(num)?"":" not ") + "a prime number.";
	}
	
	
	print(data,response);
}

function validateno(no)
{
	if(no < 1 || no >1000)
	{
		return "Please insert a number between 1 to 1000.";
	}
	else if(isNaN(no))
	{
		return "Only nummerics are allowed.";
	}
	else
	{
		return "";
	}
}

function isPrime(no)
{
	if(no === 1)
	{
		return false;
	}
	else if(no === 2)
	{
		return true;
	}
	else
	{
		var count = 0;
		for(var i=1;i<=no/2;i++)
		{
				if(no%i === 0)
				{
					count++;
				}
					
		}
		if(count > 1)
		{
			return false;
		}
		else
		{
			return true;
		}		
	}
}


function print(data,response)
{
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(data);
	response.end();
}

function findprime(response,postdata)
{
	console.log('find prime handler');
	var data = "";
	var num = postdata.substring(postdata.indexOf("=") + 1);
	
	data = validateno(num);
	
	if(data === "")
	{
		data += "---- List of prime numbers ----";
		data += "\n 1";
		for(var i=2;i<=num;i++)
		{
				data += isPrime(i)? "\n "+ i :"" ;
		}
		
	}
	
	
	print(data,response);
	
}


exports.checkprime = checkprime;
exports.findprime = findprime;