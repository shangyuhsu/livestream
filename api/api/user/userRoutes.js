var router = require('express').Router();
var userController = require('./userController');
var auth = require('../../auth/auth');
var checkUser = [auth.decodeToken(), auth.getFreshUser()];
var friendshipController = require('./friendshipController');


router.param('userid', userController.idParam);
router.param('user2id', userController.id2Param);
router.param('username', userController.userParam);
router.param('username2', userController.user2Param);
router.get('/me', checkUser, userController.me);

router.route('/')
  	.get(userController.get)
  	.post(userController.post)

router.route('/username/:username')
 	.get(userController.getOne)

router.route('/:userid')
 	.get(userController.getOne)
 	.put(checkUser, userController.put)
 	.delete(checkUser, userController.delete)

router.route('/:userid/friends')
	.get(friendshipController.getFriends)

router.route('/:userid/requests')
	.get(friendshipController.getRequests)

router.route('/:userid/requests/:username2')
	.post(checkUser, friendshipController.sendRequest)
	.put(checkUser, friendshipController.acceptRequest)

module.exports = router;
