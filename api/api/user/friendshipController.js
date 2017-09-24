var Friendship = require('./friendshipModel');


exports.sendRequest = function(req, res, next) {

  var user1 = req.user._id;
	var user2 = req.user2._id;
  //request FROM user1 to user2
  Friendship.findOne({user1: user2, user2: user1}, function(err, friendship) {
    if(friendship) {
      if (friendship.relation == "request") {
        res.json({
          error: "AlreadyRequested"
        });
      } else if (friendship.relation == "friends") {
        res.json({
          error: "AlreadyFriends"
        });
      }
      return;
    }
    else {
    //request FROM user1 to user2
      var newRequest = new Friendship({user1: user2, user2: user1, relation: 'request'});
      Friendship.create(newRequest, function(err, friendship) {
        if(err) {
          next(new Error('Error: '+ err));
          return;
        }
      res.json(JSON.stringify(friendship));
    });
  }
  });
}


exports.getRequests = function(req, res, next) {
  var id = req.user._id;
    Friendship.find({user1: id, relation:'request'})
        .populate('user2')
        .exec(function(err, requests) {
            if(err) {
              next(new Error('Error: '+ err));
              return;
            }
            res.json(requests.map(function(request){
        		return {
              username: request.user2.username,
              id: request.user2._id
            };
      		}));
    	});
}

exports.acceptRequest = function(req, res, next) {
	var user1 = req.user._id;
	var user2 = req.user2._id;
      
  Friendship.update({ user1: user1, user2: user2}, {relation: 'friends'}, function(err) {
    if(err) {
      next(new Error('Error: '+ err));
      return;
    }
    var newFriendship = new Friendship({user1: user2, user2: user1, relation: 'friends'});
    Friendship.create(newFriendship, function(err) {
      if(err) {
        next(new Error('Error: '+ err));
      } else {
        res.json(newFriendship);
      }
    });
  });
}

exports.getFriends = function(req, res, next) {
	var id = req.user._id;
	Friendship.find({user1: id, relation:'friends'})
    .populate('user2')
    .exec(function(err, friendships) {
      if(err) {
         next(new Error('Error: '+ err));
         return;
      }
      res.json(friendships.map(function(friendship){
        return {
          username: friendship.user2.username,
          id: friendship.user2._id
        };
    }));
  });
}

