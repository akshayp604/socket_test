module.exports = (app) => {
	const controller = require('../controllers/user_controller.js');
	const passport = require('passport');


	app.get('/test', controller.test);
	app.post('/addUser', controller.addUser);
	app.post('/addchat',passport.authenticate('jwt', { session: false }), controller.addchat);
	app.get('/findRoom', passport.authenticate('jwt', { session: false }),controller.findRoom);
	app.post('/UserLogin', controller.UserLogin);
	app.get('/UserList', passport.authenticate('jwt', { session: false }),controller.UserList);
	app.get('/findOneUser/:id', passport.authenticate('jwt', { session: false }),controller.findOneUser);
}