require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose'); // Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
const path = require('path');
const helmet = require("helmet"); // Helmet helps you secure your Express apps from various well-known web vulnerabilities by setting HTTP headers appropriately.
const rateLimit = require("express-rate-limit"); // Express rate limit is a middleware that can be used to limit repeated requests to public APIs and/or endpoints such as password reset.
const userRoutes = require('./routes/userRoutes');
const forumPostRoutes = require('./routes/forumPostsRoutes');
const multer = require('multer');
const promisify = require('util').promisify;
const pipeline = promisify(require('stream').pipeline);
const fs = require('fs');
const cors = require('cors');

const app = express();
const env = process.env;
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15400,
    standardHeaders: true,
    legacyHeaders: true,
    message: "Too many requests, try again later"
});

mongoose.set('strictQuery', false);  // To avoid deprecation warning
mongoose.connect(`mongodb+srv://${env.MONGO_USER_NAME}:${env.MONGO_USER_PASSWORD}@${env.MONGO_CLUSTER_ADDRESS}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to MongoDB'))
.catch(() => console.log('Failed to connect to MongoDB...'));

app.use(helmet(), helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    next();
});

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', authLimiter, userRoutes);
app.use('/api/posts', authLimiter, forumPostRoutes);

// const upload = multer();
// app.post('/api/posts', upload.single('file'), async function (req, res) {
//     const {
//         file,
//         body: { name }
//     } = req;

//     const fileName = name + Math.floor(Math.random() * 1000000) + file.detectedFileExtension;

//     await pipeline(file.stream, fs.createWriteStream(`${__dirname}/images/${fileName}`))

//     res.send('File uploaded successfully.' + fileName);
// });

module.exports = app;