require('dotenv').config()

const express = require('express')

const cors = require('cors')

const mongoose = require('mongoose');

const jwt = require('jsonwebtoken')

const app = express();

const userRoutes = require('./routes/route');

app.use((req, res, next) =>{
    console.log(req.path, req.method)
    next()
})

app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.json({mssg: 'Welcome to this app'});
})

app.use('/', userRoutes);

mongoose.connect(process.env.MONGO_URL).then(()=> {
    //Listen for requests
    app.listen(process.env.PORT, ()=> {
        console.log("Server started on port & connected to MongoDB", process.env.PORT)
    })
}).catch((error)=>{
    console.log(error);
})