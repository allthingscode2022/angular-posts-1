// module that helps us with mongodb models, schemas
const mongoose = require('mongoose')
// for building new Schemas
const Schema = mongoose.Schema
// for hasing the password
const bcrypt = require('bcrypt')
const saltRounds = 10

// building a new schema
const UserSchema = new Schema({
  firstname: {
    type: String,
    trim: true,
    lowercase: true
  },
  lastname: {
    type: String,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['client', 'premium'],
    default: 'client'
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
})

// pre hook for hashing the password
UserSchema.pre('save', function(next) {
  let user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

// method for verifying the password is valid
UserSchema.methods.verifyPassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

// export the schema as a model
module.exports = mongoose.model('User', UserSchema)
