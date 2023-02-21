require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('./models/admin');
require('./models/user');
require('./models/serviceCategory');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const serviceCategoryRoutes = require('./routes/serviceCategoryRoutes');
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

mongoose.set('strictQuery', true);
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
app.use(serviceCategoryRoutes);
