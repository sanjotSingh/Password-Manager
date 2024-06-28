const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const helmet = require('helmet');
const crypto = require('crypto');
const fs = require('fs');
const Joi = require('joi');
require('dotenv').config();
const base32 = require('base32');

const app = express();
const port = process.env.PORT || 5000;

// Helmet for security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: 'https://localhost',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Connection error:', error));

// Define schema and model
const cardSchema = new mongoose.Schema({
  siteName: String,
  username: String,
  password: {
    type: String,
    set: function(password) {
        try {
            console.log('A');
            
            // Ensure key is buffer and of correct length (32 bytes)
            const keyString = process.env.ENCRYPTION_KEY;
            const key = Buffer.from(base32.decode(keyString));
            console.log('Key Length:', keyString.length);
            if (keyString.length !== 32) {
                throw new Error('Key must be 32 bytes long for AES-256');
            }
            console.log('B');
    
            // Generate a random 16-byte IV
            const iv = crypto.randomBytes(16);
            console.log('C');
    
            // Create a Cipher instance with AES-256-CBC, the key, and the IV
            const cipher = crypto.createCipheriv('aes-256-cbc', keyString, iv);
            console.log('D');
    
            // Encrypt the password
            let encrypted = cipher.update(password, 'utf8', 'hex');
            console.log('D2');
            encrypted += cipher.final('hex');
            console.log('E');
    
            // Store IV and encrypted password in a format that can be decrypted
            return `${iv.toString('hex')}:${encrypted}`;
        } catch (error) {
            console.error('Error during encryption:', error.message);
            return null;  // Or handle the error as needed
        } finally {
            console.log('G');
        }
    },
    get: function(encryptedPassword) {
      if (!encryptedPassword) return '';

      try {
        const keyString = process.env.ENCRYPTION_KEY;
        const key = Buffer.from(base32.decode(keyString));
        if (key.length !== 32) {
            throw new Error('Key must be 32 bytes long for AES-256');
        }

        const parts = encryptedPassword.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
      } catch (error) {
          console.error('Error during decryption:', error.message);
          return null;  // Or handle the error as needed
      }
    }
  },
  internalIp: String,
  externalIp: String,
  notes: String
});
const Card = mongoose.model('Card', cardSchema);

// Joi schema validation
const cardSchemaValidation = Joi.object({
  siteName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  internalIp: Joi.string().ip(),
  externalIp: Joi.string().ip(),
  notes: Joi.string().optional()
});

// POST route to add a new credential
app.post('/credentials', async (req, res) => {
  const { error } = cardSchemaValidation.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const newCard = new Card(req.body);
  try {
    const savedCard = await newCard.save();
    // Ensure password is not sent back in response
    savedCard.password = undefined;
    res.json(savedCard);
  } catch (error) {
    res.status(500).send(error);
    console.log(`Error: ${error}`);
  }
});

// GET route to fetch all credentials
app.get('/credentials', async (req, res) => {
  try {
    const cards = await Card.find();
    // Ensure passwords are not sent back in response
    const cardsWithoutPasswords = cards.map(card => {
      card.password = undefined;
      return card;
    });
    res.json(cardsWithoutPasswords);
  } catch (error) {
    console.error(`Error fetching cards: ${error.message}`);
    res.status(500).send('Server error');
  }
});

// PUT route to edit an existing credential
app.put('/credentials/:id', async (req, res) => {
  console.log(`Received PUT request for ID: ${req.params.id}`);
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCard) {
      return res.status(404).send('Credential not found');
    }
    // Ensure password is not sent back in response
    //updatedCard.password = undefined;
    res.json(updatedCard);
  } catch (error) {
    console.error(`Error updating card: ${error.message}`);
    res.status(500).send('Server error');
  }
});

// DELETE route to delete a credential
app.delete('/credentials/:id', async (req, res) => {
  console.log(`Received DELETE request for ID: ${req.params.id}`);
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard) {
      return res.status(404).send('Credential not found');
    }
    // Ensure password is not sent back in response
    deletedCard.password = undefined;
    res.json(deletedCard);
  } catch (error) {
    console.error(`Error deleting card: ${error.message}`);
    res.status(500).send('Server error');
  }
});


// HTTPS server setup (replace with actual paths to your SSL/TLS certificates)
const options = {
  key: process.env.PRIVATE_KEY, // Replace with actual path
  cert: process.env.CERTIFICATE// Replace with actual path
};

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
