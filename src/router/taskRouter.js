const express = require('express');
const router = new express();
const Task = require('../models/task');
const auth = require('../middleware/auth')

// Task create Api
router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(task)
    }
})


// Tasks get
router.get('/tasks', auth, async (req, res) => {

    try {
        // const tasks = await Task.find({owner: req.user._id});
        await req.user.populate('tasks');
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Single task read
router.get('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id;

    try {
        const task = await Task.findOne({ id, owner: req.user._id });
        console.log(task);
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdates) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id })
        
        if (!task) {
            return res.status(404).send({
                status:404,
                message: 'Task not found'
            })
        }

        updates.forEach(update=>task[update]=req.body[update]);
        task.save();

        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete Task
router.delete('/tasks/:id',auth, async (req, res) => {
    const id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({_id:id, owner:req.user._id})
        if (!task) {
            return res.status(404).send({
                status:404,
                message: 'Task not found'
            })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;