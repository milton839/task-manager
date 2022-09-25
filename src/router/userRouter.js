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


// Update user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdates) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        updates.forEach(update => {
            req.user[update] = req.body[update];
        })

        await req.user.save();
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete User
router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;