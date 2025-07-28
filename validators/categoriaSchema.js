const Joi = require('joi');

const categoriaSchema = Joi.object({
    nome: Joi.string().min(3).max(80).required()
        .messages({
            'string.min': 'O nome da categoria deve ter no mínimo 3 caracteres',
            'any.required': 'O nome da categoria é obrigatório'
        }),
    id_user: Joi.number().integer().optional()
});

module.exports = categoriaSchema;