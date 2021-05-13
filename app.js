const bodyParser = require('body-parser');

const express = require("express");

const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');

const MONGO_URI = `
mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zfmiu.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());


app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data});
});

mongoose.connect(MONGO_URI)
.then(result => {
    app.listen(process.env.PORT || 8080);
})
.catch(err => {
    console.log(err);
});