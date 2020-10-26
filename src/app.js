const express = require('express')

const userRouter = require('./routers/user-router.js')
const taskRouter = require('./routers/task-router.js')

require('./db/mongodb.js')

const app = express()

app.use(express.json())


app.get('/', (req, res) => {
    res.send('Home Page')
})

app.use(userRouter)
app.use(taskRouter)


const port = process.env.PORT

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
