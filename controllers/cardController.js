const cardService = require('../services/cardService');
const { decrypt } = require('../utils/encryption');

exports.getCards = async (req, res) => {
  try {
    const cards = await cardService.getCards();
    const decryptedCards = cards.map(card => {
      const decryptedCard = card.toObject();

      // Decrypt each credential password
      decryptedCard.credentials = decryptedCard.credentials.map(credential => {
        return {
          ...credential,
          password: decrypt(credential.password)
        };
      });

      return decryptedCard;
    });
    res.json(decryptedCards);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.createCard = async (req, res) => {
  try {
    const card = await cardService.createCard(req.body);
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await cardService.updateCard(req.params.id, req.body);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await cardService.deleteCard(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
