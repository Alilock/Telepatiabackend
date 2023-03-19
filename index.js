const express = require('express');
const app = express();
const postRouter = require("./src/api/routers/post.router")
const authRouter = require("./src/api/routers/auth.router")
const path = require('path')
const fileUpload = require('express-fileupload')

const cors = require('cors')
app.use(fileUpload());

app.use(cors({
    origin: '*'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'src/assets/uploads')));
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Alilock:Nasrullayev1.@socialdb.crcgjsk.mongodb.net/Social_Database')
    .then(res => console.log("db succes")).catch(err => console.log("error db", err))

app.get('/', (req, res) => {
    res.send('Hello!');
})
app.use('/api/posts', postRouter)
app.use('/api/auth', authRouter)


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err?.message || "Server error",
        statusCode: err.statusCode || 500
    })
})
app.listen(8080, function () {
    console.log("server is running ")
})