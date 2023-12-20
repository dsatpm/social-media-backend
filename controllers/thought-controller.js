const { User, Thought } = require('../models');

module.exports = {
	// gets all thoughts
	getAllThoughts(req, res) {
		Thought.find({})
			.then((data) => res.json(data))
			.catch((err) => res.status(500).json(err));
	},
	// get single thought
	getSingleThought(req, res) {
		Thought.findOne({ _id: req.params.id })
			.select('-__v')
			.sort({ _id: -1 })
			.then((data) =>
				!data
					? res
							.status(404)
							.json({ message: 'No Thought found with this ID!' })
					: res.json(data)
			)
			.catch((err) => res.status(500).json(err));
	},
	//create a thought
	createThought(req, res) {
		Thought.create(req.body)
			.then(({ _id }) => {
				return User.findOneAndUpdate(
					{ _id: req.body.userId },
					{ $push: { thoughts: _id } },
					{ new: true }
				);
			})
			.then((thought) =>
				!thought
					? res
							.status(404)
							.json({ message: 'No User found with this ID!' })
					: res.json(thought)
			)
			.catch((err) => res.status(500).json(err));
	},
	//update a thought
	updateThought(req, res) {
		Thought.findOneAndUpdate(
			{ _id: req.params.thoughtId },
			{ $set: req.body },
			{ runValidators: true, New: true }
		)
			.then((user) =>
				!user
					? res
							.status(404)
							.json({ message: 'No thought found with this ID!' })
					: res.json(user)
			)
			.catch((err) => res.status(500).json(err));
	},
	//delete a thought
	deleteThought(req, res) {
		Thought.findOneAndDelete({ _id: req.params.thoughtId })
			.then((thought) =>
				!thought
					? res
							.status(404)
							.json({ message: 'No thought found with this ID!' })
					: User.findOneAndUpdate(
							{ thoughts: req.params.thoughtId },
							{ $pull: { thoughts: req.params.thoughtId } },
							{ new: true }
					  )
			)
			.then((user) =>
				!user
					? res
							.status(404)
							.json({
								message: 'Thought deleted, but no user found',
							})
					: res.json({ message: 'Thought successfully deleted' })
			)
			.catch((err) => res.status(500).json(err));
	},
	//create reaction
	createReaction(req, res) {
		Thought.findOneAndUpdate(
			{ _id: req.params.thoughtId },
			{ $addToSet: { reactions: req.body } },
			{ runValidators: true, new: true }
		)
			.then((thought) =>
				!thought
					? res
							.status(404)
							.json({ message: 'No thought found with this ID!' })
					: res.json(thought)
			)
			.catch((err) => res.status(500).json(err));
	},
	//delete reaction
	deleteReaction(req, res) {
		Thought.findOneAndUpdate(
			{ _id: req.params.thoughtId },
			{ $pull: { reactions: { reactionId: req.params.reactionId } } },
			{ runValidators: true, new: true }
		)
			.then((thought) =>
				!thought
					? res
							.status(404)
							.json({ message: 'No thought found with this ID!' })
					: res.json(thought)
			)
			.catch((err) => res.status(500).json(err));
	},
};
