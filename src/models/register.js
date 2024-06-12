const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator=require('validator')

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        // validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        require: true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

loginSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id);
        
        const token = jwt.sign({ _id: this._id.toString()}, process.env.SECRET_KEY)

        this.tokens=this.tokens.concat({token:token})
         

        await this.save()
        
        console.log(token);
        return token;
        

    } catch (e) {
        console.log(e);
        
    }
}

loginSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        console.log(`Password before : ${this.password}`);

        this.password = await bcrypt.hash(this.password, 10)

        console.log(`Password after : ${this.password}`);
    }
    next();
})



const registration = new mongoose.model('Registration', loginSchema)

module.exports = registration