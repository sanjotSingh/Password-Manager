const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const cardSchema = new mongoose.Schema({
  siteName: String,
  username: String,
  password: {
    type: String,
    set: encrypt

  },
  internalIp: String,
  externalIp: String,
  notes: String
});

module.exports = mongoose.model('Card', cardSchema);
