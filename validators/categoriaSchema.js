const Joi = require('joi');

const categoriaSchema = Joi.object({
    nome: Joi.string().min(3).max(80).required()
        .messages({
            'string.min': 'O nome da categoria deve ter no mínimo 3 caracteres',
            'any.required': 'O nome da categoria é obrigatório'
        }),
    id_user: Joi.number().integer().optional(),
    status: Joi.string().valid('Ativa', 'Desativada').default('Ativa')
});

module.exports = {
    validateCategoria: (data) => {
        if (!data || typeof data !== 'object') {
            throw new Error("Dados de atualização inválidos: 'data' está indefinido ou não é um objeto.");
        }
        const { error, value } = categoriaSchema.validate(data, { abortEarly: false });
        if (error) {
            throw error;
        }
        return value;
    }
};
