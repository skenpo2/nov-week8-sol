require('dotenv').config();
const express = require('express');
const app = express();
const Todo = require('./models/todo.schema');
const connectDB = require('./config/db');

connectDB(); // Connect to MongoDB

app.use(express.json()); // Parse JSON bodies

// GET All – Read
app.get('/todos', async (req, res, next) => {
  const queryParams = req.query.completed;

  console.log('Query Parameters:', queryParams); // Log query parameters
  try {
    let filter = {};
    if (queryParams === 'true') {
      filter.completed = true;
    } else if (queryParams === 'false') {
      filter.completed = false;
    }

    const todos = await Todo.find(filter);
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

// POST New – Create
app.post('/todos', async (req, res, next) => {
  try {
    const { task, completed } = req.body;
    if (typeof task !== 'string' || task.trim() === '') {
      return res
        .status(400)
        .json({ error: 'Task is required and must be a non-empty string.' });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return res
        .status(400)
        .json({ error: 'Completed must be a boolean value.' });
    }

    const newTodo = await Todo.create({
      task: req.body.task,
      completed: req.body.completed || false,
    });

    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
