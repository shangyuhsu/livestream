
module.exports = function(server) {
	var router = require('express').Router();

	router.use('/users', require('./user/userRoutes'));
	router.use('/streamsessions', require('./streamSession/streamSessionRoutes')(server));

	return router;
}
