const mongoose = require('mongoose')

const dbconnect = 'mongodb://127.0.0.1:27017/task-app'

mongoose.connect(dbconnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
})