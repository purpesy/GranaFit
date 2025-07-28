const Categoria = require("../models/Categoria");
const { validateCategoria } = require("../validators/categoriaSchema");
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
  try {
    let value;
    try {
      value = validateCategoria(req.body);
    } catch (err) {
      const mensagens = err.details?.map((e) => e.message) || [err.message];
      return res.status(400).json({ erros: mensagens });
    }
    const existingCategoria = await categoriaInstance.findByNome(value.nome);
    if (existingCategoria) {
      return res.status(400).json({ erro: "Categoria já cadastrada." });
    }

    await categoriaInstance.create({
      nome: value.nome,
      id_user: value.id_user || null,
      status: value.status || "Ativa"
    });

    return res.status(201).json({
      mensagem: "Categoria cadastrada com sucesso!"
    });

  } catch (err) {
    console.error("[CategoriaController]: Erro no registro de categoria:", err);
    return res.status(500).json({ erro: "Erro interno ao cadastrar." });
  }
  }

  async updateCategoria(req, res) {
    try {
      const id = req.params.id;
      let value;
      try {
        value = validateCategoria(req.body);
      } catch (error) {
        const mensagens = error.details ? error.details.map(e => e.message) : [error.message];
        return res.status(400).json({ erros: mensagens });
      }

      await categoriaInstance.update(id, {
        nome: value.nome,
        id_user: value.id_user || null,
        status: value.status || "Ativa"
      });

      return res.status(200).json({ mensagem: "Categoria atualizada com sucesso!" });

    } catch (err) {
      console.error("[CategoriaController]: Erro ao atualizar categoria:", err);
      return res.status(500).json({ erro: "Erro interno ao atualizar." });
    }
  }

  
}


module.exports = new CategoriaController();