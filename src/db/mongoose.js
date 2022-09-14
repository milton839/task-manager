const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/task-manager-api',{
    useNewUrlParser: true,
});

const User = mongoose.model('User',{
    name:{
        type: String
    },
    age:{
        type: Number
    }
})

const me = new User({
    name: "Milton",
    age: 25
})

me.save().then((me)=>{
    console.log(me);
}).catch((error)=>{
    console.log('Error', error);
})

// const Task = mongoose.model('Task', {
//     description:{
//         type: String
//     },
//     completed: {
//         type:Boolean
//     }
// })

// const tk = new Task({
//     description:'Hello i am starting node js course',
//     completed:false
// })

// tk.save().then((tk)=>{
//     console.log(tk);
// }).catch((error)=>{
//     console.log(error);
// })