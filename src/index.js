const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const { ObjectID } = require('bson');

// router
const userRouter = require('./router/userRouter');
const taskRouter = require('./router/taskRouter');

const app = express();
const port = process.env.PORT || 3000;

//middlewares
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const router = new express();

app.use(router)

app.listen(port, () => {
    console.log('Server is running this port ', port);
})