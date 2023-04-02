const express = require('express');
const app = express();
const postRouter = require("./src/api/routers/post.router")
const authRouter = require("./src/api/routers/auth.router")
const userRouter = require("./src/api/routers/user.router")
const chatRouter = require('./src/api/routers/chat.router')
const notificationRouter = require('./src/api/routers/notification.router')
const path = require('path')
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const socket = require('./src/services/socketio')(io); // pass in io object

const { firebaseConfig } = require("./src/config/firebaseconfig")
const firebase = require('firebase/app')
const fileUpload = require('express-fileupload')

const cors = require('cors')
app.use(fileUpload());

firebase.initializeApp(firebaseConfig)

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

app.use('/api/chat', chatRouter)
app.use('/api/posts', postRouter)
app.use('/api/auth', authRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/users', userRouter)
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err?.message || "Server error",
        statusCode: err.statusCode || 500
    })
})

http.listen(8080, function () {
    console.log("server is running ")
})