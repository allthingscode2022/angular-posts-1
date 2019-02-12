// loading env file
require('dotenv').config()
// importing express for creating our server
const express = require('express')
const app = express()
// helps us parse easier the client requests
const bodyParser = require('body-parser')
// allow requests from client for development purposes
const cors = require('cors')
// log each route request for development purposes
const morgan = require('morgan')
// mongodb module for building models schemas and connecting mongodb
const mongoose = require('mongoose')
// create a port
const PORT = process.env.PORT || 2000

mongoose.connect(
  `${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}/${
    process.env.MONGODB_DOCUMENT
  }`,
  { useNewUrlParser: true }
)

// middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(morgan('dev'))

// import User Controller
const UserController = require('./controllers/UserController')
// add User Controller to middleware
app.use('/user', UserController)
// import Post Controller
const PostController = require('./controllers/PostController')
// add Post Controller to middleware
app.use('/post', PostController)

// start the server
app.listen(PORT, console.log(`server listening on port: ${PORT}`))
