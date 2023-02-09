const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const path = require('path');

// define env
const { PORT,DB_URL } = require('./src/config');

// define all routes
const route = require('./src/router');
const errorHandler = require('./src/middleware/errorHandler');

// Database connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('strictQuery', false);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB Connected...')
})

app.use(cors());

// Parser Setup
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/upload', express.static('src/upload'));

// call main route file
app.use('/api', route);

// join error Handler file
app.use(errorHandler);

// server listen
app.listen(PORT, () => console.log(`Server workes on http://localhost:${PORT}`));