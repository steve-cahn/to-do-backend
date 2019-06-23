const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const uuidv4 = require('uuid/v4');
const sendMail = require('../email/sendEmail');

const verifySchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
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

verifySchema.methods.sendHashEmail = async function(email) {
	const proxyUrl = config.get('proxy-url');
	const hashVerification = `${proxyUrl}/users/${this._userId}/verify/${
		this.hash
	}`;

	const htmlEmail = `<h1>To complete registration</h1><a href="${hashVerification}">Click Here</a>
	<div>Or copy and paste this into your web browser ${hashVerification}</div>`;

	try {
		await sendMail(email, 'Verify Email', htmlEmail);
	} catch (error) {
		console.log(error);
	}
};

const Verify = mongoose.model('Verify', verifySchema);

function validateVerify(user) {
	const schema = {
		userId: Joi.objectId().required(),
		hash: Joi.string().required()
	};
	return Joi.validate(user, schema);
}

exports.Verify = Verify;
exports.validateVerify = validateVerify;
