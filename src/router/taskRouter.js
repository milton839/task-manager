const express = require('express');
const router = new express();
const Task = require('../models/task');

// Task create Api
router.post("/tasks", async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(task)
    }

    // task.save().then((task) => {
    //     res.status(201).send(task);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // })
})


// Tasks get
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }

    // tasks.then((tasks) => {
    //     res.send(tasks)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

// Single task read
router.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const task = await Task.findOne({ _id: (ObjectID(id)) });
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }

    // task.then((task) => {
    //     if (!task) {
    //         res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send();
    // })
})

// Update task
router.patch('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdates) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const updateTask = await Task.findById(id)

        updates.forEach(update=>updateTask[update]=req.body[update]);

        updateTask.save();
        // const updateTask = await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updateTask) {
            res.send()
        }
        res.status(200).send(updateTask)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete Task
router.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteTask = await Task.findByIdAndDelete(id)
        if (!deleteTask) {
            return res.status(404).send('Task not found')
        }
        res.status(200).send(deleteTask)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;