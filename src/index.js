require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('./models/user');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

mongoose.connect(MONGO_URI);
const database = mongoose.connection;

database.on('error', err => console.log(err));
database.once('connected', () => console.log('Database Connected'));

const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log('Listening on PORT:', PORT);
});

app.use(
  cors({
    origin: '*',
  })
);

app.use(authRoutes);
