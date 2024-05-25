const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 4001;

let tasks = [];

// Helper function to update task
function updateTask(index, title, description, status, dueDate) {
  tasks[index].title = title;
  tasks[index].description = description;
  tasks[index].status = status;
  tasks[index].dueDate = dueDate;
}

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Get task by ID
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(task => task.id === id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).send({ message: "Task not found" });
  }
});

// Create new task
app.post("/tasks", (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;

  const newTask = {
    id: id,
    title: title,
    description: description,
    status: status,
    dueDate: dueDate
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update task by ID
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, status, dueDate } = req.body;
  const index = tasks.findIndex(task => task.id === id);

  if (index !== -1) {
    updateTask(index, title, description, status, dueDate);
    res.json(tasks[index]);
  } else {
    res.status(404).send({ message: "Task not found" });
  }
});

// Delete task by ID
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex(task => task.id === id);

  if (index !== -1) {
    tasks.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send({ message: "Task not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
