const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const { ObjectID } = require('bson');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

// User create Api
app.post("/users",(req,res)=>{
    const user = new User(req.body);

    user.save().then((user)=>{
        res.status(201);
        res.send(user);
    }).catch((error)=>{
        res.status(400).send(error);
    })
})

// users get
app.get('/users', (req, res) => {
    const users = User.find({})
    users.then((users) => {
        res.send(users)
    }).catch((error) => {
        res.status(500).send(error)
    })
})


// Single user get
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = User.findById(id)
    user.then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((error) => {
        res.status(500).send()
    })
})

// Task create Api
app.post("/tasks",(req,res)=>{
    const task = new Task(req.body);

    task.save().then((task)=>{
        res.status(201).send(task);
    }).catch((error)=>{
        res.status(400).send(error);
    })
})


// Tasks get
app.get('/tasks',(req,res)=>{
    const tasks = Task.find({})
    tasks.then((tasks)=>{
        res.send(tasks)
    }).catch((error)=>{
        res.status(500).send()
    })
})

// Single task read
app.get('/tasks/:id', (req,res)=>{
    const id = req.params.id;

    const task = Task.findOne({_id:(ObjectID(id))})
    task.then((task)=>{
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    }).catch((error)=>{
        res.status(500).send();
    })
})

app.listen(port,()=>{
    console.log('Server is running this port ', port);
})