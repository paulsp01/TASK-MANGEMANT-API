const Task = require("../models/Task");
const User = require("../models/User");


exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedUser } =
      req.body;

    const users = await User.find({ _id: { $ne: req.user.id } });

    
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

   
    const query = { user: req.user.id };

    
    if (status) {
      query.status = status;
    }

   
    if (priority) {
      query.priority = priority;
    }

    
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


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    
    if (!task) return res.status(404).json({ message: "Task not found" });

    
    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    
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

    
    if (!task) return res.status(404).json({ message: "Task not found" });

   
    if (
      task.assignedUser.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

   
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};