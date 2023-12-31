const User = require('../model/user')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
    console.log(err.message, err.code)
    
    let errors = {email:'', password:''}

    // INCORRECT EMAIL
    if(err.message === 'Incorrect Email')  {
        errors.email = 'That Email Is Not Registered'
    }

    if(err.message === 'Incorrect Password')  {
        errors.password = 'That Password Is Not Registered'
    }

    //DUPLICATE ERROR CODE
    if(err.code === 11000) {
        errors.email = 'that email is already registered'
        return errors
    }

    // VALIDATE ERROR
    if(err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message 
        })
    }

    return errors
}

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({id}, 'net ninja secret', {
        expiresIn: maxAge
    })
}

const signup_get = (req,res) => {
    res.render('signup')
}

const login_get = (req,res) => {
    res.render('login')
}

const signup_post = async (req,res) => {
    const { email, password } = req.body
    try {
        const user = await User.create({email, password})
        const token = createToken(user._id)
        res.cookie('jwt', token, {
            httpOnly:true,
            maxAge : maxAge * 1000
        })
        .status(201)
        .json({
            status:'success',
            user : user._id
        })
    } catch(err) {
        const errors = handleErrors(err)
        res
        .status(400)
        .json({
            status:'failed',
            message:errors
        })
        }
    }


const login_post = async  (req,res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token , {
            httpOnly:true,
            maxAge: maxAge * 1000
        })
        res
        .status(200)
        .json({
            user:user._id
        })
    } catch(err) {
        const errors = handleErrors(err)
        res
        .status(400)
        .json({
            message:errors
        })
    }
}

const logout_get = (req, res) =>{
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/')
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
}
