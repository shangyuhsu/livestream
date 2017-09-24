var Port = require('./portModel');
var shell = require('shelljs');
var User = require('./../user/userModel');
var Friendship = require('./../user/friendshipModel');

module.exports = function(io) {
      
  class StreamSession {
    constructor(id, username, blurb) {
      this.id = id;
      this.username = username;
      this.blurb = blurb;
      this.listeners;
      this.startSocketServer();
      this.init_stream();
    }

    startSocketServer() {
      var nsp = io.of('/'+this.username);
      nsp.on('connection', function(socket){
        var username = socket.handshake.query.user;
        if(!this.listeners[username]) {
          this.listeners[username] = true;
          console.log(username+' connected');
        }
        socket.username = username;
        socket.on('new message', function(data) {
            console.log(data.username +" says " + data.message);
            socket.broadcast.emit('new message', {
              username: data.username,
              message: data.message
            });
        });
      });
    }

    lsCommand(username, ls_port) {
      var command = `liquidsoap -v 'out(output.icecast(%mp3(bitrate=32), mount="/${username}.mp3", port=8000, host="localhost", password="shangyu",fallible=true, input.harbor("mount",port=${ls_port}, user="shangyu",password="hsu")))'`;
      return command;
    }

    init_stream() {
      this.ls_port = Port.getPort();
      var username = this.username;
      var ls_command = this.lsCommand(username, this.ls_port);
      console.log(ls_command);
      shell.exec(ls_command, function(code, stdout, stderr){
        console.log(`Stream for ${username} ended`);
      });
    }
  }

  StreamSession.endSession = function(session) {
    delete io.nsps['/'+session.username];
  }

  /*module.updateListeners= function(user, num_listeners, callback) {
      StreamSession.update( {user:user._id}, {num_listeners: num_listeners}, function(err) {
        callback(err);
      });
  }*/

  return StreamSession;
}

/*
PREVIOUS IMPLEMENTATION: sessions stored in database
var StreamSessionSchema = new Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  }, 

  ls_port: {
    type: Number,
    required: true,
    unique: true
  },

  chat_port: {
    type: Number,
    required: true,
    unique: true
  },

  status: String,

  blurb: String,

  num_listeners: Number

});
*/