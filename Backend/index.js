const express = require('express');
const  mongoose  = require('mongoose');
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const discussion = require('./routes/api/discussion')
const bodyParser = require('body-parser');
const passport = require('passport');



const app = express();

//Body parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//Database

const database = require('./confign/keys').mongoURI;

//MongoDB connection

mongoose.connect(database).then(()=>{
    console.log('MongoDB Connected')
})
    .catch(err => {
        console.log(err)
    })


//passport auth

app.use(passport.initialize());
require('./confign/passport.js')(passport);

app.get('/', (req,res) =>{ 
    res.send('Hello');
});


//Routes

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/discussion',discussion);

const port = 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


