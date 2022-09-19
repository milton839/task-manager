const express = require('express');
const router = new express();
const User = require('../models/user');


// User create Api
router.post("/users", async (req, res) => {
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

router.post('/users/login', async (req, res)=>{
    console.log(req.body.email, req.body.password);
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        console.log(user);
        res.send(user);
    }catch(error){
        res.status(400).send(error)
    }
})

// users get
router.get('/users', async (req, res) => {
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
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdates) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    const id = req.params.id;
    const updatedData = req.body;

    try {
        const updateUser = await User.findById(id);
        console.log(updateUser);

        updates.forEach(update => {
            console.log(update);
            updateUser[update] =req.body[update];
        })

        await updateUser.save();
        // const updateUser = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
        if (!updateUser) {
            return res.status(404).send()
        }
        res.send(updateUser)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete User
router.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteUser = await User.findByIdAndDelete(id)
        if (!deleteUser) {
            return res.status(404).send('User not found')
        }
        res.status(200).send(deleteUser)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;