const { ToDo, validate } = require('../models/toDo');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get Completed To Dos
router.get('/completed', auth, async (req, res) => {
	const toDos = await ToDo.find({ isCompleted: true, _userId: req.user._id })
		.select('-__v')
		.sort({ dateAdded: 'desc' });

	res.send(toDos);
});

// Get Incompleted To Dos
router.get('/incompleted', auth, async (req, res) => {
	const toDos = await ToDo.find({ isCompleted: false, _userId: req.user._id })
		// const toDos = await ToDo.find({ isCompleted: false })
		.select('-__v')
		.sort({ dateAdded: 'desc' });

	res.send(toDos);
});

module.exports = router;
