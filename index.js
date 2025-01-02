const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const UserRouter = require("./routes/UserRouter");
const cloudinary = require('cloudinary').v2;
const CourseRouter = require("./routes/CourseRouter");
const Enrollment = require("./routes/Enrollment");
const cookieParser = require('cookie-parser');
const cors = require('cors');


require('dotenv').config();

const allowedOrigins = ['http://localhost:3000', 'https://lms-6aiv.onrender.com/'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser());
require('./db');

cloudinary.config({
  cloud_name: process.env.Cloudinery_NAME,
  api_key: process.env.Cloudinery_API_KEY,
  api_secret: process.env.Cloudinery_API_SECRET,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'PUBLIC')));

app.use('/api/user', UserRouter);

app.use('/api/course', CourseRouter);
app.use('/api/enroll', Enrollment);

// Route to serve the index.html page


// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
