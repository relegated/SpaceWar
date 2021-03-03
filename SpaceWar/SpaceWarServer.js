// Using express: http://expressjs.com/
let Ships = [];
let YourShip;
let Torpedo_Launched = false;
let Phaser_On = false;
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 8000, listen);
function listen() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}
app.use(express.static('public'));
var io = require('socket.io')(server);
setInterval(function () {
  let Data = { Me: Ships[YourShip], TorpedoLaunched: Torpedo_Launched, PhaserOn: Phaser_On, MyId: YourShip };
  io.sockets.emit('UpdateShip', Data);
}, 33);
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