var net = require('net');
var request = require('request');

// Client server info
var HOST = '127.0.0.1';
var PORT = 14523;
const MAX_CONNECTIONS = 3;
var ConnectedClientsList = {}; // store all connections

// xcaller info
const URLBASE = "http://localhost:4004";
const URLMAXTRIX =  URLBASE + "/docs/matrix.txt";
var LedStr = "init";

var server = net.createServer(function(socket) {
  ConnectedClientsList[socket.remoteAddress +':'+ socket.remotePort] = socket;
  let msg = "Welcome to xled " + socket.remoteAddress +':'+ socket.remotePort;
  console.log(msg);
  console.log("Total connection: " + server.connections); // server.getConnections(function(err, count){})

	socket.write(msg + "\n");
	socket.write(LedStr);
	// socket.pipe(socket);

  socket.on('data', function(data) {
    console.log('DATA ' + socket.remoteAddress + ':' + socket.remotePort + " " + data);
    // socket.write('You said "' + data + '"');
  });

  socket.on('close', function(data) {
    delete ConnectedClientsList[socket.remoteAddress +':'+ socket.remotePort];
    console.log('CLOSED: ' + socket.remoteAddress + ':' + socket.remotePort);
    console.log("Total connection: " + server.connections);
  });

  socket.on('end', function(data) {
    console.log('ENDED: ' + socket.remoteAddress + ':' + socket.remotePort);
  });

  socket.on('error', function(data) {
    console.log('ERROR: ' + socket.remoteAddress + ':' + socket.remotePort + ' ' + data.toString());
  });
});

server.on('data', function(data) {
  console.log("Got msg: " + data.toString());
});

server.listen(PORT, HOST, function() {
  server.maxConnections = MAX_CONNECTIONS;
  console.log("Server is listening on " + HOST + ":" + PORT);
  console.log("Max concurrent connections: " + server.maxConnections);
});


// Getting matrices info
function getMatrices() {
  // create infinity loop
  setTimeout(function () {
    getMatrices();
  }, 2000);

  request.get(URLMAXTRIX, 
    function (error, response, body) {
      if (error) {
        console.log("Error on getting matrix.txt: " + error);
        return;
      }
      if (response.statusCode !== 200) {
        console.log("unexpected status code: " + response.statusCode);
        return;
      }

      // Check for update
      if (LedStr != body) {
        LedStr = body;
        console.log("Sending msg to client: " + LedStr);
        for (let client in ConnectedClientsList) {
          // console.log("Sending msg to " + ConnectedClientsList[client].remoteAddress + ':' + ConnectedClientsList[client].remotePort);
          ConnectedClientsList[client].write(LedStr);
        }
      }
    });
};

// Trigger infinity loop for request matrix
getMatrices();
