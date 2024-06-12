const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/registration2-api')
    .then(() => {
        console.log('Database connection is established');
    }).catch((e) => {
        console.log('No Connection');
    })