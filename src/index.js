const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const { ObjectID } = require('bson');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

// User create Api
app.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
    // user.save().then((user) => {
    //     res.status(201);
    //     res.send(user);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // })
})

// users get
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
    }


    // users.then((users) => {
    //     res.send(users)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})


// Single user get
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }

    // const user = User.findById(id)
    // user.then((user) => {
    //     if (!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

// Update user
app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdates) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    const id = req.params.id;
    const updatedData = req.body;

    try {
        const updateUser = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
        if (!updateUser) {
            return res.status(404).send()
        }
        res.send(updateUser)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete User
app.delete('/users/:id', async(req, res)=>{
    const id = req.params.id;

    try{
        const deleteUser = await User.findByIdAndDelete(id)
        if (!deleteUser) {
            return res.status(404).send('User not found')
        }
        res.status(200).send(deleteUser)
    }catch(error){
        res.status(500).send(error)
    }
})

// Task create Api
app.post("/tasks", async (req, res) => {
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
app.get('/tasks', async (req, res) => {

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
app.get('/tasks/:id', async (req, res) => {
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
app.patch('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdates) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const updateTask = await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updateTask) {
            res.send()
        }
        res.status(200).send(updateTask)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete Task
app.delete('/tasks/:id', async (req, res) => {
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

app.listen(port, () => {
    console.log('Server is running this port ', port);
})