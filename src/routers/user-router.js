const express = require('express')

const User = require('../models/user.js')
const auth = require('../middlewares/auth.js')

const router = new express.Router()


//POST Request to Create User
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})

//POST Request to Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.LoginCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})


//GET Request to View Profile
router.get('/users/profile', auth, async (req, res) => {
    res.status(200).send(req.user)
})

//POST Request to Logout Profile
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('Logged out!')
    } catch (e) {
        res.status(500).send()
    }
})

//POST Request to Logout of All Sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logged Out of All Sessions!')
    } catch (e) {
        res.status(500).send()
    }
})

//PATCH Request to Update User
router.patch('/users/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['name', 'age', 'email', 'password']
    const isValid = updates.every((update) => {
        return allowed.includes(update)
    })

    if(!isValid) {
        throw new Error ({ Error: 'Invalid Update' })
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})

//DELETE Request to Delete Profile
router.delete('/users/delete', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router