const { User, Thought } = require('../models');

module.exports= {
    // Obtiene todos los user
    getUsers(req, res) {
        User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },
    // Obtiene un user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .populate('thoughts')
        .populate('friends')
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No existe usuario con ese ID' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Crea un user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => {
            return res.status(500).json(err);
        });
    },
    // Actualiza un curso
    updateUser(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((user) =>
        !user
            ? res.status(404).json({ message: 'No existe usuario con ese ID' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Elimina un curso
    deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No existe usuario con ese ID' })
            : Thought.deleteMany({ _id: { $in: user.thoughts} })
        )
        .then(() => res.json({ message: 'Usuario con pensamientos borrados!' }))
        .catch((err) => res.status(500).json(err));
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.params.friendId } },
          { runValidators: true, new: true }
        )
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No existe usuario con ese ID' })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
    },
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId  } },
            { runValidators: true, new: true }
          )
            .then((application) =>
              !application
                ? res.status(404).json({ message: 'No existe usuario con ese ID' })
                : res.json(application)
            )
            .catch((err) => res.status(500).json(err));
        },
}
