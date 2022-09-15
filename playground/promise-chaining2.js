require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('63220c1b9acc59dac392506e').then((task)=>{
//     console.log(task);
//     return Task.countDocuments({complete:false})
// }).then((result)=>{
//     console.log(result);
// }).catch((error)=>{
//     console.log(error);
// })

const deleteTaskAndCount = async (id, completed) => {
    const user = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed });
    return count;
}

deleteTaskAndCount('6322db79f3ff6f1865d43c80', false).then((count) => {
    console.log(count);
}).catch((error) => {
    console.log(error);
})