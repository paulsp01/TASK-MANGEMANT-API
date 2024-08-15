const Task = require("../models/Task");
const User = require("../models/User");

// Create a new task and assign it to one user among the list of users
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedUser } =
      req.body;

    const users = await User.find({ _id: { $ne: req.user.id } });

    // If no assignedUser is provided, randomly select one from the list
    let assignedUserId;
    if (assignedUser) {
      assignedUserId = assignedUser;
    } else if (users.length > 0) {
      const randomIndex = Math.floor(Math.random() * users.length);
      assignedUserId = users[randomIndex]._id;
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user.id,
      assignedUser: assignedUserId,
    });

    await task.save();
    res.status(201).json({
      message: "Task created successfully",
      task: { id: task._id, ...task._doc },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    // Build the query object
    const query = { user: req.user.id };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add priority filter if provided
    if (priority) {
      query.priority = priority;
    }

    // Add search filter for title or description if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task - Only admin or task owner can update
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the logged-in user is the task owner or an admin
    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Task updated successfully", updatedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the logged-in user is the task owner or an admin
    if (
      task.assignedUser.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete the task
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};