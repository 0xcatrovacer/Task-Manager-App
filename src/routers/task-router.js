const express = require('express')

const Task = require('../models/task.js')
const auth = require('../middlewares/auth')

const router = new express.Router()

//POST Request to Add Task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//GET Request to View Tasks
router.get('/tasks',auth, async (req, res) => {
    try{
        const task = await req.user.populate ({
            path: 'tasks'
        }).execPopulate()

        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

//GET Request to View Task by ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task) {
            return res.status(404).send('Not Found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//PATCH Request to Update Task
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowed = ['description', 'completed']
    
    const isValid = updates.every((update) => {
        return allowed.includes(update)
    })
    
    if(!isValid) {
        throw new Error ({ Error: 'Invalid Update' })
    }
    
    try{
        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task) {
            return res.status(404).send('Not Found')
        }
        
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)
        
    } catch (e) {
        res.status(500).send(e)
    }
})

//DELETE Request to Delete Task
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id : req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send('Task not Found')
        }

        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router