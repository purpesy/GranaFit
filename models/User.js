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
}

module.exports = new User();
