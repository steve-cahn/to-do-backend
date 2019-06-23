const { Verify, validateVerify } = require('../models/verify');
const { User } = require('../models/user');
const uuidv4 = require('uuid/v4');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/:id/verify/:hash', async (req, res) => {
	const { error } = validateVerify({
		userId: req.params.id,
		hash: req.params.hash
	});
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).send('The user was not found');
	if (user.verified === true)
		return res.status(200).send('Acount already verified');

	const verification = await Verify.findOne({ _userId: req.params.id });
	if (!verification || verification.hash != req.params.hash)
		return res.status(400).send('Invalid Verification');

	user.verified = true;
	await user.save();

	await Verify.deleteOne({ _userId: verification._userId });

	const token = user.generateAuthToken();
	req.session.token = token;
	res.send(token);
});

router.post('/verify/resend', async (req, res) => {
	const user = await User.findById(req.body._id);
	if (!user) return res.status(404).send('The user was not found');

	if (user.verified === true)
		return res.status(400).send('Acount already verified');

	const dbOptions = {
		upsert: true,
		new: true,
		setDefaultsOnInsert: true
	};
	const verify = await Verify.findOneAndUpdate(
		{ _userId: user._id },
		{ hash: uuidv4() },
		dbOptions
	);

	verify.sendHashEmail(user.email);

	const token = user.generateAuthToken();
	req.session.token = token;
	res.send(token);
});

module.exports = router;
