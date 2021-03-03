// Using express: http://expressjs.com/
let gamePieces = [];
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 8000, listen);
app.use(express.static('public'));
var io = require('socket.io')(server);
function listen() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}

setInterval(HeartBeat, 33);

function HeartBeat() {
  io.sockets.emit('heartbeat', gamePieces);
}

io.sockets.on('connection', function (socket) {
  console.log("We have a new client: " + socket.id);

  socket.on('start',
    function (data) {
      console.log(socket.id + " " + data.x + " " + data.y);
      var ship = new Ship(socket.id, data.x, data.y);
      gamePieces.push(ship);
    }
  );

  socket.on('UpdateShip', function(data) {
    console.log(data);
  });

  socket.on('disconnect', function () {
    console.log("Client has disconnected");
  });
});

io.sockets.on('UpdateShip',
  function (data) {
    console.log(data);
  }
);

function sendData(data) {
  io.sockets.emit('UpdateShip', data);
}

Array.prototype.insertAt = function(index, item) {
  this.splice(index, 0, item);
};
/*
function handleRequest(request, response) {
  response.writeHead(200, {
      'Content-Type': 'text/html'
  });
  fs.readFile('public/index.html', null, function (error, data) {
      if (error) {
          response.writeHead(404);
          respone.write('file not found');
      } else {
          response.write(data);
      }
      response.end();
  });
};
https.createServer(handleRequest).listen(8000);
*/