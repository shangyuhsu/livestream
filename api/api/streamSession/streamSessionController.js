module.exports = function(server) {

  var io = require('socket.io')(server);
  var StreamSession = require('./streamSessionModel')(io);
  var Friendship = require('./../user/friendshipModel');
  var User = require('./../user/userModel');
  var Port = require('./portModel');

  var sessions = [];

  var module = [];

  function findSessionById(id, callback) {
    for(var i = 0; i<sessions.length; i++) {
      var session = sessions[i];
      if(session.id.equals(id)) {
        callback(session, i);
        return;
      }
    }
    callback(null);
  }

  function findSessionByUsername(username, callback) {
    for(var i = 0; i<sessions.length; i++) {
      var session = sessions[i];
      if(session.username === username) {
        callback(session, i);
        return;
      }
    }
    callback(null);
  }

  module.sessionIdParam = function(req, res, next, id) {
    findSessionById(id, function(session, index) {
      if (session) {
        session.index = index;
        req.session = session;
        next();
      } else {
        res.json({
            error: "SessionNotFound"
        });
      }
    });
  }

    module.sessionUsernameParam = function(req, res, next, username) {
      
      findSessionByUsername(username, function(session, index) {
      if (session) {
        session.index = index;
        req.session = session;
        next();
      } else {
        res.json({
            error: "SessionNotFound"
        });
      }
    });
  }

  module.get = function(req, res, next) {
      res.json(sessions.map(function(session) {
        return session;
      }));
  }

  module.getOne = function(req, res, next) {
    var session = req.session;
    res.json(session);
  }

  module.post = function(req, res, next) {

    var id = req.user._id;
    var username = req.user.username;
    var blurb = req.body.blurb;

    findSessionById(id, function(session, index) {
      if(session) {
        res.json({
            error: "SessionAlreadyExists",
            session: session
        });
      } else {
        var session = new StreamSession(id, username, blurb);
        sessions.push(session);
        res.json({session: session});
      }
    });
  }

  module.delete = function(req, res, next) {
    var session = req.session;
    Port.returnPort(session.ls_port, function(err) {
      if(err) {
        next(err);
      }
      sessions.splice(session.index, 1);
      StreamSession.endSession(session);
      res.json(session);
    });
  }

  module.getFriendSessions = function(req, res, next) {
    var friendSessions = [];
    Friendship.find({ 'user1': req.params.userId, 'relation': 'friends'}, function (err, friendships) {
      if (err) {
        next(err);
        return;
      } else {
        var friends = [];

        friendships.forEach(function(friendship) {
          friends.push(friendship.user2);
        });
        console.log(friends);
        for(var i = 0; i < friends.length; i++) {
          friend = friends[i];
          findSessionById(friend, function(session, index) {
             console.log(session);
            if(session) {
              friendSessions.push(session);
            }
          });
        }
        res.json(friendSessions.map(function(session) {
          return session;
        }));
      
      }
    });
  }
    
  return module;
  
}