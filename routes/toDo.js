const { ToDo, validate } = require('../models/toDo');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get All To Dos
router.get('/', auth, async (req, res) => {
	const toDos = await ToDo.find({ _userId: req.user._id })
		.select('-__v')
		.sort({ dateAdded: 'desc' });

	res.send(toDos);
});

// Add a ToDo Item
router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let toDo = new ToDo({ name: req.body.name, _userId: req.body._userId });
	toDo = await toDo.save();

	res.send(toDo);
});

// Modify a ToDo Ite
router.put('/:id', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const { name, isCompleted, dateAdded } = req.body;

	const toDo = await ToDo.findByIdAndUpdate(
		req.params.id,
		{
			name,
			isCompleted,
			dateAdded
		},
		{ new: true }
	);

	if (!toDo)
		return res
			.status(400)
			.send('The to do item with the given ID was not found.');

	res.send(toDo);
});

// Delete a Todo Item
router.delete('/:id', async (req, res) => {
	const toDo = await ToDo.findByIdAndRemove(req.params.id);

	if (!toDo)
		return res
			.status(400)
			.send('The to do item with the given ID was not found.');

	res.send(toDo);
});

module.exports = router;
