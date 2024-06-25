const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const fs = require('fs');


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


const options = {
    key: fs.readFileSync('/path/to/your/private.key'),
    cert: fs.readFileSync('/path/to/your/certificate.crt')
  };
  
  https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
  });


  
mongoose.connect('mongodb://localhost:27017/password_manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('connection error:', error);
});

const cardSchema = new mongoose.Schema({
  siteName: String,
  username: String,
  password: String,
  internalIp: String,
  externalIp: String,
  notes: String
});

const Card = mongoose.model('Card', cardSchema);

// GET route to fetch all credentials
app.get('/credentials', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST route to add a new credential
app.post('/credentials', async (req, res) => {
  const newCard = new Card(req.body);
  try {
    const savedCard = await newCard.save();
    res.json(savedCard);
  } catch (error) {
    res.status(500).send(error);
    console.log(`Error: ${error}`);
  }
});

// PUT route to edit an existing credential
app.put('/credentials/:id', async (req, res) => {
  console.log(`Received PUT request for ID: ${req.params.id}`); // Log the ID
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCard) {
      return res.status(404).send('Credential not found');
    }
    res.json(updatedCard);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


// DELETE route to delete a credential
app.delete('/credentials/:id', async (req, res) => {
    console.log(`Received DELETE request for ID: ${req.params.id}`); // Log the ID
    try {
      const deletedCard = await Card.findByIdAndDelete(req.params.id);
      if (!deletedCard) {
        return res.status(404).send('Credential not found');
      }
      res.json(deletedCard);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
