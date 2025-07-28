var db = require("../database/connection.js");

class Categoria {
  async findAll(userId) {
    try {
      const categorias = await db("tbl_categoria")
        .select(
          "id_categoria",
          "nome_categoria",
          "id_user",
          "status_categoria",
          "criado_em",
          "atualizado_em"
        ).where("id_user", userId) .orWhereNull("id_user");  
      return categorias;
    } catch (error) {
      console.error(
        "[CategoriaModel] Erro ao buscar categorias:",
        error.message
      );
      throw error;
    }
  }
  
  async findById(id) {
    try {
      const categoria = await db("tbl_categoria")
        .select("id_categoria", "nome_categoria", "id_user", "status_categoria", "criado_em", "atualizado_em")
        .where("id_categoria", id)
        .first();
      return categoria;
    } catch (error) {
      console.error("[CategoriaModel] Erro ao buscar categoria por ID:", error.message);
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

  async createForUser(categoriaData, userId) {
  try {
    const newCategoria = await db("tbl_categoria").insert({
      nome_categoria: categoriaData.nome,
      id_user: userId,
      status_categoria: categoriaData.status || 'Ativa',
      criado_em: new Date()
    });
    return newCategoria;
  } catch (error) {
    console.error("[CategoriaModel] Erro ao criar categoria do usuário:", error.message);
    throw error;
  }
}

  async createGlobal(categoriaData) {
  try {
    const newCategoria = await db("tbl_categoria").insert({
      nome_categoria: categoriaData.nome,
      id_user: null,
      status_categoria: categoriaData.status || 'Ativa',
      criado_em: new Date()
    });
    return newCategoria;
  } catch (error) {
    console.error("[CategoriaModel] Erro ao criar categoria global:", error.message);
    throw error;
  }
}


  async update(id, data) {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error("Dados de atualização inválidos: 'data' está indefinido ou não é um objeto.");
        }
        const updatedCategoria = await db("tbl_categoria")
            .where("id_categoria", id)
            .update({
                nome_categoria: data.nome,
                id_user: data.id_user || null,
                status_categoria: data.status|| "Ativa",
                atualizado_em: new Date()
            });

        return updatedCategoria;
    } catch (error) {
        console.error("[CategoriaModel] Erro ao atualizar categoria:", error.message);
        throw error;
    }
  }

  async delete(id) {
    try {
      const deletedCategoria = await db("tbl_categoria")
        .where("id_categoria", id)
        .del();
      return deletedCategoria;
    } catch (error) {
      console.error("[CategoriaModel] Erro ao deletar categoria:", error.message);
      throw error;
    }
  }

}

module.exports = Categoria;
