var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());

var buffer;
app.get('/', function(request, response) {
    fs.readFile('./index.html', 'utf8', function(err,data){
	if(err)throw err;
	buffer = data.toString();
//	console.log(data);
    });
    
    //response.send('Hello World v2!');
    response.send(buffer);
});

var port = process.env.PORT || 8080 ;
app.listen(port, function() {
  console.log("Listening on " + port);
});
