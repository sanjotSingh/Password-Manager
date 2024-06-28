const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const config = require('../config/config.js');
require('dotenv').config();

const utiity = require('../utils/encryption.js')
const corsOptions = {
  origin: 'https://localhost', // Allow requests from this origin
  optionsSuccessStatus: 200
};
const app = express();


app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Connection error:', error));

const cardRoutes = require('../routes/cardRoutes');
app.use('/api/cards', cardRoutes);

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
  console.log(utiity.decrypt("2e72d6f5dbf9a519cd9b31731975e544:12d07cf8bacef05d4375725ed2d0627d944d6d37aefdbbe21ac294b178990bc3"));

  
});

const options = {
  key: process.env.PRIVATE_KEY,
  cert:process.env.CERTIFICATE
};



https.createServer(options, app).listen(config.port, () => {
  console.log(`Server is running on https://localhost:${config.port}`);
});
