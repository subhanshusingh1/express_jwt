const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'email has not been provided'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, 'please enter a valid email']
    },
    password:{
        type:String,
        required:[true, 'password has not been provided'],
        minlength: [8, 'minimum password length is 6 character']
    }
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})
    if(user) {
       const auth =  await bcrypt.compare(password, user.password)
       if(auth) {
        return user
       } throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}

module.exports = mongoose.model('User', userSchema)