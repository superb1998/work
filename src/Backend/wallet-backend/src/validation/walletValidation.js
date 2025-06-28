const Joi = require('joi');

function validateSeedPhrase(phrase) {
  if (!Array.isArray(phrase)) {
    return { error: 'Phrase must be an array of words.' };
  }
  if (![12, 24].includes(phrase.length)) {
    return { error: 'Seed phrase must be 12 or 24 words.' };
  }
  const schema = Joi.array().items(
    Joi.string().pattern(/^[a-zA-Z]{2,12}$/).required()
  ).length(phrase.length);
  const { error } = schema.validate(phrase);
  return error ? { error: error.details[0].message } : {};
}

function validatePrivateKey(privateKey) {
  const schema = Joi.string()
    .pattern(/^(0x)?[a-fA-F0-9]{64}$/)
    .required();
  const { error } = schema.validate(privateKey);
  return error ? { error: error.details[0].message } : {};
}

module.exports = { validateSeedPhrase, validatePrivateKey };
