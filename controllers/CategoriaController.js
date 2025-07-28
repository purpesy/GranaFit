const Categoria = require("../models/Categoria");
const CategoriaSchema = require("../validators/categoriaSchema");
const categoriaInstance = new Categoria();

class CategoriaController {
  async index(req, res) {
    try {
      const categorias = await categoriaInstance.findAll();
      if (categorias.length === 0) {
        return res.status(404).json({ error: "Nenhuma categoria encontrada" });
      }
      return res.status(200).json(categorias);
    } catch (error) {
      console.error("[CategoriaController]: Erro ao buscar categorias:", error);
      return res.status(500).json({ error: "Erro interno ao buscar categorias" });
    }
  }

  async newCategoria(req, res) {
    const { error, value } = CategoriaSchema.validate(req.body, {
      abortEarly: false,
    });

      if (error) {
        const mensagens = error.details.map((err) => err.message);
        return res.status(400).json({ error: mensagens });
      }

      const existingCategoria = await categoriaInstance.findByNome(value.nome);
      if (existingCategoria) {
        return res.status(400).json({ erro: "Categoria já cadastrada." });
      }

      await categoriaInstance.create({
        nome_categoria: value.nome,
        id_user: value.id_user || null
      });

      return res.status(201).json({
        mensagem: "Categoria cadastrada com sucesso!"
      });
    } catch (err) {
      console.error("[CategoriaController]: Erro no registro de categoria:", err);
      return res.status(500).json({ erro: "Erro interno ao cadastrar." });
    }
}


module.exports = new CategoriaController();