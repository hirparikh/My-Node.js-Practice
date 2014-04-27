/**
 * New node file
 */
var server = require("./server");
var Router = require("./Router");
var requestHandlers = require("./RequestHandlers");

var handle = {};

handle["/Isprime"] = requestHandlers.checkprime;
handle["/Primeseries"] = requestHandlers.findprime;


server.start(Router.route,handle);	