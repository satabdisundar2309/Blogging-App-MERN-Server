require('dotenv').config()
const cloudinary = require('cloudinary').v2;

const cloudinaryConnection = async ()=>{
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME ,
        api_key: process.env.API_KEY ,
        api_secret: process.env.API_SECRET
    })
    console.log("Cloudinary connection established...")
}

module.exports = cloudinaryConnection;