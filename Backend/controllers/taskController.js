import Task from '../Schema/Task.js';

export const createTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ message: 'Task title is required' });

        const task = new Task({ title, description, userId: req.user._id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { title, description, completed } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, description, completed },
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.json(task);
    } catch (err) {
        next(err);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
};
