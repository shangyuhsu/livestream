var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var checkToken = expressJwt({ secret: 'secret' });
var User = require('../api/user/userModel');

exports.decodeToken = function() {
  return function(req, res, next) {
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }

    checkToken(req, res, next);
  };
};

exports.getFreshUser = function() {
  return function(req, res, next) {
    User.findById(req.user._id)
      .then(function(user) {
        if (!user) {
          next(new Error('Unauthorized'));
        } else {
          req.user = user;
          next();
        }
      }, function(err) {
        next('Error: ' + err);
      });
  }
};

exports.verifyUser = function() {
  return function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
      res.json({
          error: 'NoUserOrPass'
      });
    }

    User.findOne({username: username})
      .then(function(user) {
        if (!user) {
          res.json({
            error: 'NoSuchUser'
          });
        } else {
          if (!user.authenticate(password)) {
            res.json({
              error: 'WrongPassword'
            }); 
          } else {
            req.user = user;
            next();
          }
        }
      }, function(err) {
        next(err);
      });
  };
};

exports.signToken = function(id) {
  return jwt.sign(
    {_id: id},
    'secret',
  );
};
