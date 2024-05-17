const mongoose = require('mongoose')
require('dotenv').config()

const dbConnection = ()=>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            console.log("DB Connection successful");
        }).catch((e)=>{
            console.log("Error in db connection ", e)
        })
}

module.exports = dbConnection;