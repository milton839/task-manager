const express = require('express');
const router = new express();
const User = require('../models/user');
const auth = require('../middleware/auth');


// User create Api
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error)
    }
})

// Login system
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })
        await req.user.save();
        res.send()
    }catch(error){
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send()
    }catch(error){
        res.status(500).send(error)
    }
})

// users get
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
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
            updateUser[update] = req.body[update];
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