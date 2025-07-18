const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(3).max(80).required()
    .messages({
      'string.min': 'O nome deve ter no mínimo 3 caracteres',
      'any.required': 'O nome é obrigatório'
    }),
  foto: Joi.string().allow('', null),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Email inválido',
      'any.required': 'O email é obrigatório'
    }),
  password: Joi.string().min(6).max(200).required()
    .messages({
      'string.min': 'A senha deve ter no mínimo 6 caracteres',
      'any.required': 'A senha é obrigatória'
    }),
  token_verificacao: Joi.string().optional()
});

module.exports = userSchema;
