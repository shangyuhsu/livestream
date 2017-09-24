var User = require('./userModel');
var _ = require('lodash');
var signToken = require('../../auth/auth').signToken;

exports.idParam = function(req, res, next, id) {
  User.findById(id)
    .select('-password')
    .exec()
    .then(function(user) {
      if (!user) {
        res.json({
          error: "UserIdNotFound"
        });
      } else {
        req.user = user;
        next();
      }
    }, function(err) {
      if(err)
        next(new Error('Error: '+ err));
    });
};

exports.id2Param = function(req, res, next, id) {
  User.findById(id)
    .select('-password')
    .exec()
    .then(function(user) {
      if (!user) {
        res.json({
          error: "UserIdNotFound"
        });
      } else {
        req.user2 = user;
        next();
      }
    }, function(err) {
      if(err)
        next(new Error('Error: '+ err));
    });
};

exports.userParam = function(req, res, next, username) {
  User.findOne({username: username})
    .select('-password')
    .exec()
    .then(function(user) {
      if (!user) {
        res.json({
          error: "UsernameNotFound"
        });
      } else {
        req.user = user;
        next();
      }
    }, function(err) {
      if(err)
        next(new Error('Error: '+ err));
    });
};

exports.user2Param = function(req, res, next, username) {
  User.findOne({username: username})
    .select('-password')
    .exec()
    .then(function(user) {
      if (!user) {
        res.json({
          error: "UsernameNotFound"
        });
      } else {
        req.user2 = user;
        next();
      }
    }, function(err) {
      if(err)
        next(new Error('Error: '+ err));
    });
};

exports.get = function(req, res, next) {
  User.find({})
    .select('-password')
    .exec()
    .then(function(users){
      res.json(users.map(function(user){
        return user.toJson();
      }));
    }, function(err){
      next(new Error('Error: '+ err));
    });
};

exports.getOne = function(req, res, next) {
  var user = req.user.toJson();
  res.json(user.toJson());
};

exports.put = function(req, res, next) {
  var user = req.user;

  var update = req.body;

  _.merge(user, update);

  user.save(function(err, saved) {
    if (err) {
      next(new Error('Error: '+ err));
    } else {
      res.json(saved.toJson());
    }
  })
};

exports.post = function(req, res, next) {
  User.findOne({username:req.body.username}, function(err, user) {
    if(user) {
      res.json({
          error: "UsernameTaken" 
      });
      return;
    }

    var newUser = new User(req.body);

    newUser.save(function(err, user) {
      if(err) { 
        next(new Error('Error: '+ err));
      }
      var token = signToken(user._id);
      res.json({
        token: token,
        username: user.username, 
        id: user._id});
      });
  });
};

exports.delete = function(req, res, next) {
  req.user.remove(function(err, removed) {
    if (err) {
      next(new Error('Error: '+ err));
    } else {
      res.json(removed.toJson());
    }
  });
};

exports.me = function(req, res) {
  res.json(req.user.toJson());
};
