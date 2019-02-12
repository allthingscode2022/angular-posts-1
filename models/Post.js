// module that helps us with mongodb models, schemas
const mongoose = require('mongoose')
// for building new Schemas
const Schema = mongoose.Schema

// building a new schema
const PostSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  image: {
    type: String,
    trim: true,
    required: true
  },
  body: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  creator: {
    type: String,
    trim: true,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: null
  }
})

// export the schema as a model
module.exports = mongoose.model('Post', PostSchema)
