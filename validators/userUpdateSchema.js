const Joi = require('joi');

const userUpdateSchema = Joi.object({
  nome_user: Joi.string().min(3).max(80).optional(),
  foto_user: Joi.string().uri().allow('', null).optional(),
  email_user: Joi.string().email().optional(),
  senha_user: Joi.string().min(6).optional()
});

module.exports = userUpdateSchema;
