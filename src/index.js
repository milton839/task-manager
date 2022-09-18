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

var bcrypt = require('bcryptjs');

const myFunction = async () => {
    const password = 'Red12345';
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(password);
    console.log(hashedPassword);

    const isMatch = await bcrypt.compare(password, hashedPassword)
    console.log(isMatch);
}

myFunction();