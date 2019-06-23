const { User, validate } = require('../models/user');
const { Verify } = require('../models/verify');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const express = require('express');
const router = express.Router();
const config = require('config');

router.get('/me', async (req, res) => {
	res.send(req.session.token);
});

router.get('/logout', async (req, res) => {
	try {
		await req.session.destroy();
	} catch (error) {
		res.send('Could not log out');
	}
});

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });

	if (user) return res.status(400).send('This email is already in use.');

	user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		imgURL: req.body.imgURL
	});

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(req.body.password, salt);

	user = await user.save();

	const verify = new Verify({ _userId: user._id, hash: uuidv4() });
	await verify.save();

	verify.sendHashEmail(user.email);

	const token = user.generateAuthToken();
	req.session.token = token;
	res.send(token);
});

router.put('/:id', async (req, res) => {
	delete req.body._id;

	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true
	});

	if (!user)
		return res
			.status(400)
			.send('The user with the given ID was not found.');

	req.session.token = user.generateAuthToken();
	res.send(user);
});

module.exports = router;
