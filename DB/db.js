require('dotenv').config()
const mongoose=require('mongoose');

const DB_URL = process.env.MONGODB_URL;
const connect=async()=>{
    try {
        await mongoose.connect(DB_URL)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.warn("error==> "+error.message)
        process.exit(1)
    }
}
module.exports=connect;