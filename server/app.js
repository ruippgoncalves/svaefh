const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config({ path: './config/config.env' });

// DB
connectDB();

// Server app declaration
const app = express();

// CORS
app.use(cors());

// Middleware
app.use(express.json());

// Logging (Dev Only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1', require('./routes/v1'));

// Listen on Port
const port = process.env.PORT || 3000;
app.listen(port, () =>
    console.log(`O servidor está a funcionar na porta ${port}`)
);
