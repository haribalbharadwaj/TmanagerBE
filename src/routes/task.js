const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); 


const {
    createTask,
    getTasksByUser,
    updateTaskStatus,
    editTask,
    deleteTask
}= require('../controller/task');

// Route for creating a task (protected)
router.post('/tasks',verifyToken , createTask);

// Route for getting tasks by user (protected)
router.get('/tasks/:id', verifyToken ,getTasksByUser);

// Route for updating task status (protected, for drag-and-drop functionality)
router.put('/tasks/status/:id', verifyToken ,updateTaskStatus);

// Route for editing task (protected)
router.put('/tasks/:taskId', verifyToken ,editTask);

// Route for deleting a task (protected)
router.delete('/tasks/:taskId', verifyToken ,deleteTask);

module.exports = router;
