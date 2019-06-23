const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const uuidv4 = require('uuid/v4');
const sendMail = require('../email/sendEmail');

const resetPassword = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		ref: 'User'
	},
	hash: { type: String, required: true },
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		index: { expires: 86400 }
	}
});

resetPassword.methods.sendHashEmail = async function() {
	const proxyUrl = config.get('proxy-url');
	const resetURL = `${proxyUrl}/login/reset-password/${this.email}/${
		this.hash
	}`;

	const htmlEmail = `<h1><a href="${resetURL}">Click Here</a> to Reset your Password</h1>
	<div>Or copy and paste this into your web browser ${resetURL}</div>`;

	try {
		await sendMail(this.email, 'Reset Password', htmlEmail);
	} catch (error) {
		console.log(error);
	}
};

const ResetPassword = mongoose.model('ResetPassword', resetPassword);

function validateResetPassword(user) {
	const schema = {
		email: Joi.string()
			.required()
			.email(),
		hash: Joi.string().required()
	};
	return Joi.validate(user, schema);
}

exports.ResetPassword = ResetPassword;
exports.validateResetPassword = validateResetPassword;
