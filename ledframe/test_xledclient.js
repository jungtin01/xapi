var net = require('net');
var HOST = '127.0.0.1';
var PORT = 14523;

var client = net.connect(PORT, HOST, function() {
  console.log('Connected to server!');
  // client.setTimeout(3000);
  client.write('Hello, server!');
});

client.on('data', function(data) {
  console.log("Got msg: " + data.toString());
  // client.end(); // this one is called when client want to close the connection
});

client.on('error', function(data) { 
  console.log('error from server: ' + data.toString());
});

client.on('timeout', function() {
  console.log("socket timeout");
  // client.end();
});

client.on('end', function() {
  console.log('disconnected from server');
});

client.on('close', function(data) {
  console.log('closed connection from server: ' + data.toString());
});