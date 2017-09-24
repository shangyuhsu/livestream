module.exports = function(server) {
	var router = require('express').Router();
	var controller = require('./streamSessionController')(server);
	var auth = require('../../auth/auth');
	var checkUser = [auth.decodeToken(), auth.getFreshUser()];

	router.param('sessionId', controller.sessionIdParam);
	router.param('username', controller.sessionUsernameParam);

	router.route('/')
	  .get(controller.get)
	  .post(checkUser, controller.post)

	router.route('/:sessionId')
		.delete(controller.delete)
	  	.get(controller.getOne)

	 router.route('/username/:username')
	  	.get(controller.getOne)

	router.route('/friends/:userId')
	  .get(controller.getFriendSessions)

	return router;
}
