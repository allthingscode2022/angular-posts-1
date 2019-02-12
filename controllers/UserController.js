// importing our User model
const User = require('../models/User')
// for creating a token when a user logs in
const jwt = require('jsonwebtoken')
// import express router for our user routes creation
const router = require('express').Router()

/**
 *  this route will receive the users registration form data and store it
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} email
 * @param {string} password
 * @returns {object} status || json
 */
router.post('/register', (req, res) => {
  // if firstname does not exist on req body do something
  if (!req.body.firstname) {
    res.status(400).send({
      success: false,
      message: 'firstname is required'
    })
  } else {
    // if lastname does not exist on req body
    if (!req.body.lastname) {
      res.status(400).send({
        success: false,
        message: 'lastname is required'
      })
    } else {
      // if email does not exist on req body
      if (!req.body.email) {
        res.status(400).send({
          success: false,
          message: 'email is required'
        })
      } else {
        // if password does not exist on req body
        if (!req.body.password) {
          res.status(400).send({
            success: false,
            message: 'password is required'
          })
        } else {
          // if we have all params go ahead and see if user exists if it does not exist go ahead and create the user
          User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
              res.status(400).send({
                err,
                success: false,
                message: 'an error ocurred'
              })
            } else {
              if (user) {
                res.status(400).send({
                  success: false,
                  message: 'There is already a user with that email'
                })
              } else {
                User.create(
                  {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password
                  },
                  (err, user) => {
                    if (err) {
                      res.status(400).send({
                        err,
                        success: false,
                        message:
                          'an error ocurred when trying to save your information'
                      })
                    } else {
                      if (user) {
                        res.status(200).send({
                          user: {
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            role: user.role
                          },
                          success: true,
                          message: 'Registration Successfull'
                        })
                      } else {
                        res.status(400).send({
                          success: false,
                          message: 'Registration Failed. Try again please'
                        })
                      }
                    }
                  }
                )
              }
            }
          })
        }
      }
    }
  }
})

/**
 * Login route verifys email and password
 * @param {string} email
 * @param {string} password
 * @returns {object}
 */

router.post('/login', (req, res) => {
  // if email does not exist do something
  if (!req.body.email) {
    res.status(400).send({
      success: false,
      message: 'email is required'
    })
  } else {
    // if password does not exist
    if (!req.body.password) {
      res.status(400).send({
        success: false,
        message: 'password is required'
      })
    } else {
      // if we have all params go ahead and find the user compare the password and if all is good go ahead and create a jwt token to be returned to the client
      User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
          res.status(400).send({
            err,
            success: false,
            message: 'an error occurred try again please'
          })
        } else {
          if (user) {
            user.verifyPassword(req.body.password, (err, isMatch) => {
              if (err) {
                res.status(400).send({
                  err,
                  success: false,
                  message: 'An error ocurred, please try again'
                })
              } else {
                if (isMatch) {
                  const token = jwt.sign(
                    {
                      name: `${user.firstname} ${user.lastname}`,
                      email: user.email
                    },
                    process.env.JWT_TOKEN,
                    { expiresIn: '1h' }
                  )
                  res.status(200).send({
                    success: true,
                    message: 'Authentication successfull',
                    user: {
                      token,
                      firstname: user.firstname,
                      lastname: user.lastname,
                      email: user.email,
                      role: user.role
                    }
                  })
                } else {
                  res.status(401).send({
                    success: false,
                    message: 'Authentication failed. Password did not match'
                  })
                }
              }
            })
          } else {
            res.status(401).send({
              success: false,
              message: 'Authentication failed. Email doest not exist'
            })
          }
        }
      })
    }
  }
})

module.exports = router
