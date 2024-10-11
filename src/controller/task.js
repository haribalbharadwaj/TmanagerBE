const Task = require('../model/task')

// Create a new task
const createTask = async (req, res) => {
  try {
    const { taskName, description } = req.body;
    const newTask = new Task({
      taskName,
      description,
      userId: req.user._id,  // This will be set by JWT middleware
    });
    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get tasks by user
const getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });  // Corrected user ID reference
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// Update task status (drag and drop functionality)
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
      return res.status(400).json({ success: false, message: 'Task ID and status are required' });
  }

 
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
  }
    res.status(200).json({ success: true, task: updatedTask });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};  

// Edit task details
const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskName, description } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { taskName, description },
      { new: true }
    );
    res.status(200).json({ success: true, task: updatedTask });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


module.exports = {
    createTask,
    getTasksByUser,
    updateTaskStatus,
    editTask,
    deleteTask
};
