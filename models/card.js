const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

// Define the credentials sub-schema
const credentialSchema = new mongoose.Schema({
  type: String,
  value: String,
  password: {
    type: String,
    set: encrypt
  }
});

const cardSchema = new mongoose.Schema({
  siteName: String,
  internalIP: String,
  externalIP: String,
  notes: String,
  credentials: [credentialSchema]  // Use the credentials sub-schema as an array
});

module.exports = mongoose.model('Card', cardSchema);
