const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const mongooseDateFormat = require('mongoose-date-format');

// Esquema para crear el modelo de Post
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);
// Crea una propiedad virtual `getTags` que obtenga la cantidad de etiquetas asociadas con una aplicación
thoughtSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return this.reactions.length;
  });

// Inicializa nuestro modelo de aplicación
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
