var db = require("../database/connection.js");

class Categoria {
  async findAll() {
    try {
      const categorias = await db("tbl_categoria")
        .select(
          "id_categoria",
          "nome_categoria",
          "id_user",
          "status_categoria",
          "criado_em",
          "atualizado_em"
        )
      return categorias;
    } catch (error) {
      console.error(
        "[CategoriaModel] Erro ao buscar categorias:",
        error.message
      );
      throw error;
    }
  }

  async findByNome(nome) {
    try {
      const categoria = await db("tbl_categoria")
        .select("id_categoria", "nome_categoria", "id_user", "status_categoria", "criado_em", "atualizado_em")
        .where("nome_categoria", nome)
        .first();
      return categoria;
    } catch (error) {
      console.error("[CategoriaModel] Erro ao buscar categoria por nome:", error.message);
      throw error;
    }
  }

  async create(categoriaData) {
    try {
      const newCategoria = await db("tbl_categoria").insert({
        nome_categoria: categoriaData.nome_categoria,
        id_user: categoriaData.id_user || null
      });
      return newCategoria;
    } catch (error) {
      console.error("[CategoriaModel] Erro ao criar categoria:", error.message);
      throw error;
    }
  }
}

module.exports = Categoria;
