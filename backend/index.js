import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());

// In-memory data storage (acts like a temporary database)
let todos = [
  { id: 1, task: 'Learn REST APIs', done: false },
  { id: 2, task: 'Build a To-Do App', done: false }
];

// GET all todos
app.get('/todos', function (req, res) {
  res.json(todos);
});

// GET single todo by ID
app.get('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id);

  // .find() returns the first item where the condition is true
  const todo = todos.find(function (t) {
    return t.id === id;
  });

  if (!todo) {
    res.status(404).json({ error: 'Todo not found' });
  } else {
    res.json(todo);
  }
});

// POST create new todo
app.post('/todos', function (req, res) {
  if (!req.body.task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    done: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT update entire todo
app.put('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id);

  // Find the index of the todo with the given ID
  const todoIndex = todos.findIndex(function (t) {
    return t.id === id;
  });

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Replace the whole object
  todos[todoIndex] = {
    id: id,
    task: req.body.task,
    done: req.body.done
  };

  res.json(todos[todoIndex]);
});

// PATCH partially update todo
app.patch('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id);

  // .find() returns the actual object with the matching ID
  const todo = todos.find(function (t) {
    return t.id === id;
  });

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Update only provided fields
  if (req.body.task !== undefined) {
    todo.task = req.body.task;
  }
  if (req.body.done !== undefined) {
    todo.done = req.body.done;
  }

  res.json(todo);
});

// DELETE a todo
app.delete('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id);

  // .filter() creates a new array excluding the todo with given ID
  const newTodos = todos.filter(function (t) {
    return t.id !== id;
  });

  if (newTodos.length === todos.length) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos = newTodos;
  res.status(204).send(); // No content
});

// Start server
const PORT = 3000;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
});
