var db = require("../database/connection.js");

class User {
  async findAll() {
    try {
      var result = await db.select().from("tbl_users");
      return result;
    } catch (error) {
      console.error("Erro ao buscar usuários: ", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      var result = await db.select().from("tbl_users").where("id_user", id);
      return result;
    } catch (error) {
      console.error("Erro ao buscar usuário: ", error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const result = await db("tbl_users").where("email_user", email).first();
      return result || null;
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw error;
    }
  }

  async create(userData) {
    try {
      const result = await db("tbl_users").insert({
        nome_user: userData.nome_user,
        foto_user: userData.foto_user || null,
        email_user: userData.email_user,
        senha_user: userData.senha_user,
        token_verificacao: userData.token_verificacao || null,
        email_verificado: false,
        status_user: "ativo",
      });
      return result;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      await db("tbl_users").where("id_user", id).update(data);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  async softDelete(id) {
    try {
      const affectedRows = await db("tbl_users")
        .where("id_user", id)
        .update({ status_user: "suspenso" });
      return affectedRows;
    } catch (error) {
      console.error("Erro ao suspender usuário:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const affectedRows = await db("tbl_users").where("id_user", id).del();
      return affectedRows; // número de registros deletados
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }
}

module.exports = new User();
