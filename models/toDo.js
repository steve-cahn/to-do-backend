const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const ToDo = mongoose.model(
	'ToDo',
	new mongoose.Schema({
		_userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		name: {
			type: String,
			required: true
		},
		dateAdded: {
			type: Date,
			default: Date.now
		},
		isCompleted: {
			type: Boolean,
			default: false
		}
	})
);

function validateToDo(toDo) {
	const schema = {
		_userId: Joi.objectId().required(),
		name: Joi.string().required(),
		dateAdded: Joi.date(),
		isCompleted: Joi.boolean()
	};
	return Joi.validate(toDo, schema);
}

exports.ToDo = ToDo;
exports.validate = validateToDo;
