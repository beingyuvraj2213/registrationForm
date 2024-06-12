require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const registration = require('./models/register')
require('./db/conn')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const auth=require('./middleware/auth')

const port = process.env.PORT || 2213

const staticPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(staticPath))

app.use(cookieParser())

app.set('view engine', 'hbs')


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/secret',auth,(req, res) => {
    res.render('secret')
    // if(req.cookies.jwt){
    // res.render('secret')
    // }
    // else
    // res.send('You need to login to access the secret page')
})

app.get('/logout',auth,async(req,res)=>{

    // For single logout

    // req.user.tokens=req.user.tokens.filter((currElement)=>{
    //     return currElement.token!=req.token
    // })

    // Logout from all devices

    req.user.tokens=[]

    await req.user.save()

    res.clearCookie('jwt')
    res.render('home')
})


app.post('/', async (req, res) => {
    console.log(req.body);

    if (req.body.formType == 'register') {

        const userEmail = req.body.email;

        // registration.exists({ email: email }).then(result => {
        //     console.log(`fas gya yaha : ${result}`);

        // })

        const findUser = async () => {
            try {
                const user = await registration.findOne({ email: userEmail })

                if (user) {
                    res.send('Email already exist')
                }

                else {

                    const newRegister = new registration({

                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.pwd
                    })



                    const token = await newRegister.generateAuthToken() 


                    // res.cookie() is used to set the cookie name to value

                    res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 30000),
                        httpOnly: true
                    })



                    const registered = await newRegister.save()

                    // await registration.insertMany([data])
                    console.log(registered);

                    res.status(201).render('index', {
                        user: req.body.name
                    })
                }



            } catch (e) {
                console.log(e);

            }
        }

        findUser()
    }


    else {
        try {

            const check = await registration.findOne({ email: req.body.email1 })

            const isMatch = await bcrypt.compare(req.body.pwd1, check.password)


            // Here check is an instance of our database table

            if (isMatch) {
                const token = await check.generateAuthToken()

                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 190000),
                    httpOnly: true
                })

                console.log(`Awesome :${req.cookies.jwt}`);
                

                res.render('index', {
                    user: check.name
                })
            }
            else {
                res.send("Wrong Password")

            }

        } catch (e) {
            res.send(`Account doesn't exist`)
        }

    }

})


// const createToken = async()=>{
//     const token = await jwt.sign({_id:'12345678'},'thisismytemporarysecretkey',{expiresIn:'2 seconds'})

//     console.log(token);

//     const userVer=await jwt.verify(token,'thisismytemporarysecretkey')

//     console.log(userVer);

// }

// createToken()

app.listen(port, () => {
    console.log(`Connection established at port ${port}`);

})

