const express = require('express');
const toDos = require('../routes/toDo');
const filterToDos = require('../routes/filterTodos');
const auth = require('../routes/auth');
const verification = require('../routes/verification');
const users = require('../routes/users');
const resetPassword = require('../routes/reset-password');
const imageS3 = require('../routes/imageS3');
const helmet = require('helmet');
const cors = require('cors');
const config = require('config');

module.exports = function(app) {
	app.use(
		cors({
			origin: config.get('proxy-url'),
			credentials: true
		})
	);

	app.use(helmet());
	require('../middleware/session')(app);

	app.use(express.json());
	app.use('/api/toDos', toDos);
	app.use('/api/toDos/filter', filterToDos);
	app.use('/api/users/auth', auth);
	app.use('/api/users', users, verification);
	app.use('/api/reset-password', resetPassword);
	app.use('/api/aws', imageS3);
};
