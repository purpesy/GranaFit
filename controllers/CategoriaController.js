const Categoria = require("../models/Categoria");
const { validateCategoria } = require("../validators/categoriaSchema");
const categoriaInstance = new Categoria();

class CategoriaController {
  async index(req, res) {
    try {
        const userId = req.user.id;
      const categorias = await categoriaInstance.findAll(userId);
      if (categorias.length === 0) {
        return res.status(404).json({ error: "Nenhuma categoria encontrada" });
      }
      return res.status(200).json(categorias);
    } catch (error) {
      console.error("[CategoriaController]: Erro ao buscar categorias:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar categorias" });
    }
  }

  async findCategoria(req, res) {
    const { id } = req.params;
    try {
      const categoria = await categoriaInstance.findById(id);
      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }
      return res.status(200).json(categoria);
    } catch (error) {
      console.error("[CategoriaController]: Erro ao buscar categoria:", error);
      return res.status(500).json({ error: "Erro ao procurar categoria" });
    }
  }

  async newCategoria(req, res) {
  try {
    const userId = req.user.id;

    let value;
    try {
      value = validateCategoria(req.body);
    } catch (err) {
      const mensagens = err.details?.map((e) => e.message) || [err.message];
      return res.status(400).json({ erros: mensagens });
    }

    const existing = await categoriaInstance.findByNome(value.nome);
    if (existing) {
      return res.status(400).json({ erro: "Categoria já cadastrada." });
    }

    await categoriaInstance.createForUser(value, userId);

    return res.status(201).json({ mensagem: "Categoria criada com sucesso!" });

  } catch (err) {
    console.error("[CategoriaController]: Erro ao criar categoria:", err);
    return res.status(500).json({ erro: "Erro interno ao cadastrar categoria." });
  }
  }

  async createCategoriaGlobal(req, res) {
  try {
    const value = validateCategoria(req.body);

    await categoriaInstance.createGlobal(value);

    return res.status(201).json({ mensagem: 'Categoria global criada com sucesso!' });
  } catch (err) {
    console.error("[CategoriaController]: Erro ao criar categoria global:", err);
    return res.status(500).json({ erro: 'Erro interno ao criar categoria global.' });
  }
}



  async updateCategoria(req, res) {
    try {
      const id = req.params.id;
      let value;
      try {
        value = validateCategoria(req.body);
      } catch (error) {
        const mensagens = error.details
          ? error.details.map((e) => e.message)
          : [error.message];
        return res.status(400).json({ erros: mensagens });
      }

      await categoriaInstance.update(id, {
        nome: value.nome,
        id_user: value.id_user || null,
        status: value.status || "Ativa",
      });

      return res
        .status(200)
        .json({ mensagem: "Categoria atualizada com sucesso!" });
    } catch (err) {
      console.error("[CategoriaController]: Erro ao atualizar categoria:", err);
      return res.status(500).json({ erro: "Erro interno ao atualizar." });
    }
  }

  async deleteCategoria(req, res) {
    try {
      const id = req.params.id;
      const deletedCount = await categoriaInstance.delete(id);

      if (deletedCount === 0) {
        return res.status(404).json({ erro: "Categoria não encontrada." });
      }

      return res.status(200).json({ mensagem: "Categoria excluída com sucesso!" });
    } catch (err) {
      console.error("[CategoriaController]: Erro ao excluir categoria:", err);
      return res.status(500).json({ erro: "Erro interno ao excluir." });
    }
  }

}

module.exports = new CategoriaController();
