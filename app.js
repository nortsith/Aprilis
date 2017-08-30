var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{'forceNew':true});
var database =  require('./routes/database');

app.get('/',function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.use('/public',express.static(__dirname + '/public'));

app.use('/',database);

serv.listen(process.env.PORT || 2000);
console.log("Server Started");

var SOCKET_LIST = {};
io.sockets.on('connection',function(socket){
  socket.id = Math.random();
  console.log('User connected > '+socket.id);
  SOCKET_LIST[socket.id] = socket;
  emit_to_all('user_connected',Object.keys(SOCKET_LIST).length);

  socket.on('disconnect',function(){
    delete SOCKET_LIST[socket.id];
    console.log('User Disconnected > '+socket.id);
    emit_to_all('user_disconnected',Object.keys(SOCKET_LIST).length);
  });

  socket.on('new_game_added',function(data){
    emit_to_all('add_new_game',data);
  });
});

function emit_to_all(action,variable){
  for(var user in SOCKET_LIST){
    SOCKET_LIST[user].emit(action,variable);
  }
}
