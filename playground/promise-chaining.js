require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('632209c0928982f8662dee58', { age: 10 }).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })

const updateUserAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id,{age});
    const count = await User.countDocuments({age});
    return count;
}

updateUserAndCount('632209c0928982f8662dee58', 2).then((count) => {
    console.log(count);
}).catch((error) => {
    console.log(error);
})