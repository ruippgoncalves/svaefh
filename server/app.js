const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config({ path: './config/config.env' });

// Passport Config
require('./config/passport')(passport);

// DB
connectDB();

// Server app declaration
const app = express();

// CORS
app.use(cors());

// Middleware
app.use(passport.initialize());
app.use(express.json());

// Logging (Dev Only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/votacao', require('./routes/votacao'));
app.use('/email', express.static('email'));

// Listen on Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`O servidor está a funcionar na porta ${port}`));
