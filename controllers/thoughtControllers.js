const { Thought, User } = require('../models');

module.exports= {
    // Obtiene todos los thought
    getThoughts(req, res) {
        Thought.find()
        .populate('reactions')
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    // Obtiene un thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .populate('reactions')
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No hay pensamiento con ese ID' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Crea un thought
    createThought(req, res) {
        Thought.create(req.body)
          .then((thought) => {
            //Buscar usuario para agregar el thought
            return User.findOneAndUpdate( 
              { username: req.body.username },
              { $addToSet: { thoughts: thought._id } }, 
              { new: true }
            );
          })
          .then((user) =>
            !user
              ? res.status(404).json({message: 'Se creo pensamiento, pero no se encontro usuario',})
              : res.json(user)
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
    // Actualiza un pensamiento
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: 'No hay pensamiento con ese id!' })
            : res.json({ message:'Se modifico pensamineto'})
        )
        .catch((err) => res.status(500).json(err));
    },
    // Elimina un curso
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: 'No hay pensamiento con ese id!' })
                : Thought.deleteMany({ _id: { $in: thought.reactions} })
                .then((thought) =>
                !thought
                  ? res.status(404).json({ message: 'No thought found with this id' })
                  : User.findOneAndUpdate(
                      { thoughts: req.params.thoughtId },
                      { $pull: { thoughts: req.params.thoughtId } }, //Remove thought deleted for user
                      { new: true }
                    )
              )
        )
        .then(() => res.json({ message: 'Pensamiento y reaccion borrados' }))
        .catch((err) => res.status(500).json(err));
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No hay pensamiento con ese id!' })
              : res.json({ message:'Se agrego reaccion'})
          )
          .catch((err) => res.status(500).json(err));
    },
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No hay pensamiento con ese id!' })
              : res.json({ message:'reaccion borrada'})
          )
          .catch((err) => res.status(500).json(err));
      },
}
