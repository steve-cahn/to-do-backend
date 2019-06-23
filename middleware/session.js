const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = function(app) {
	var sess = {
		secret: 'topMostSecret',
		cookie: { token: null },
		saveUninitialized: false,
		resave: true,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
	};

	if (app.get('env') === 'production') {
		app.set('trust proxy', 1); // trust first proxy
		sess.cookie.secure = true; // serve secure cookies
	}

	app.use(session(sess));
};
