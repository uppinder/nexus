var server = require('./server/app');

var port = process.env.PORT || 4000;

server.listen(port, function(){
	console.log('Server Running...');
});