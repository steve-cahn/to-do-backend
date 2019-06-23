const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	phone: {
		type: String
	},
	imgURL: {
		type: String,
		default: 'https://sim-to-do.s3-us-west-1.amazonaws.com/avatar.png'
	},
	verified: {
		type: Boolean,
		default: false
	}
});

userSchema.methods.generateAuthToken = function() {
	const { id, name, email, verified, phone, imgURL } = this;

	const token = jwt.sign(
		{
			_id: id,
			name,
			verified,
			email,
			phone,
			imgURL
		},
		config.get('jwtPrivateKey')
	);

	return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
	const schema = {
		name: Joi.string().required(),
		email: Joi.string()
			.required()
			.email(),
		phone: Joi.string(),
		imgURL: Joi.string(),
		password: Joi.string().required()
	};
	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
