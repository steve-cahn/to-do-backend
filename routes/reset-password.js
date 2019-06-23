const {
	ResetPassword,
	validateResetPassword
} = require('../models/reset-password');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/send-email', async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(404).send('The user was not found');

	const dbOptions = {
		upsert: true,
		new: true,
		setDefaultsOnInsert: true
	};
	const resetPassword = await ResetPassword.findOneAndUpdate(
		{ email: user.email },
		{ hash: uuidv4() },
		dbOptions
	);

	resetPassword.sendHashEmail(user.email);
	res.send({ success: true });
});

router.put('/reset', async (req, res) => {
	const { error } = validateResetPassword({
		email: req.body.email,
		hash: req.body.hash
	});
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(404).send('The user was not found');

	const resetPassword = await ResetPassword.findOne({
		email: req.body.email
	});
	if (!resetPassword || resetPassword.hash != req.body.hash)
		return res.status(400).send('Invalid Verification');

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(req.body.password, salt);
	await user.save();

	await ResetPassword.deleteOne({ email: resetPassword.email });

	const token = user.generateAuthToken();
	req.session.token = token;
	res.send({ success: true });
});

module.exports = router;
