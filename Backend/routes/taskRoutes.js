import express from 'express';
import Task from '../Schema/Task.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new task
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const task = new Task({
            userId: req.user.userId, // Retrieved from JWT
            title,
            description: description || '',
            status: status || 'pending',
            priority: priority || 'medium',
            dueDate: dueDate ? new Date(dueDate) : null,
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all tasks for a user
router.get('/', authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a task
router.put('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a task
router.delete('/:id', authenticate, async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
