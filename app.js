require('dotenv').config({path:'./config/.env'})
const express = require("express")
const bodyParser = require('body-parser');
const connectDB = require('./config/mongodb');
const morgan = require('morgan');
const app = express()


var port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB()

app.listen(port,()=>{
    console.log(`Server is running to port ${port}`);
})