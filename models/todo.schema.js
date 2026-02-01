const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  },
);

const Todo = mongoose.model('NovTodo', todoSchema);

module.exports = Todo;
