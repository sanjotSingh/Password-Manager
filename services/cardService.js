const Card = require('../models/card');

exports.getCards = async () => {
  return await Card.find();
};

exports.createCard = async (data) => {
  const card = new Card(data);
  return await card.save();
};

exports.updateCard = async (id, data) => {
  return await Card.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteCard = async (id) => {
  return await Card.findByIdAndDelete(id);
};
