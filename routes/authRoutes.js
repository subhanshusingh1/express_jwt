const express = require('express')
const Router = express.Router()
const {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
} = require('../controllers/authController')

Router.get('/signup', signup_get)
Router.post('/signup', signup_post)
Router.get('/login', login_get)
Router.post('/login', login_post)
Router.get('/logout', logout_get)

module.exports = Router