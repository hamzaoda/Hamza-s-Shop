require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const db = require('./DB/db')
const userRouter = require('./Routes/userRouter')
const categoryRouter = require('./Routes/categoryRouter')
const upload = require('./Routes/upload')
const productsRouter = require('./Routes/productRouter')
const paymentRouter = require('./Routes/paymentRouter')
const path = require('path')

//Connect to the DB
db();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["https://hamza-s-shop-production.up.railway.app"],
    credentials: true
}));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : 'C:/Users/THE WOLF/Desktop/E-commerce/tmp/'
}));

app.use('/user', userRouter);
app.use('/api', categoryRouter)
app.use('/api', upload)
app.use('/api', productsRouter)
app.use('/api', paymentRouter)



app.get('/', (req, res) =>{
    res.status(200).json({
        msg:"Welcom To My Shop",
    })
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log('Server is Running on Port: ', PORT);
})
