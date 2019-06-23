const mongoose = require('mongoose');
const config = require('config');

module.exports = async function() {
	const mongoosOptions = {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	};
	const db = config.get('db');

	try {
		await mongoose.connect(db, mongoosOptions);
		console.log(`DB Connected to ${db}`);
	} catch (error) {
		console.error('Could not connect to Mongose DB', error);
	}
};
