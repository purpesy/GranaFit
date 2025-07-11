var User = require("../models/User");
const userSchema = require("../validators/userSchema");
const bcrypt = require("bcrypt");

class UserController {
  async index(req, res) {
    try {
      var users = await User.findAll();
      if (!users || users.length === 0) {
        return res.status(404).json({ error: "Nenhum usuário encontrado" });
      } else {
        return res.status(200).json(users);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários: ", error);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  async findUser(req, res) {
    const { id } = req.params;
    try {
      var user = await User.findById(id);
      if (!user || user.length === 0) {
        return res.status(404).json({ error: "Nenhum usuário encontrado" });
      } else {
        return res.status(200).json(user);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Não foi possível procurar usuário." });
    }
  }

  async newUser(req, res) {

    try {
      const { error, value } = userSchema.validate(req.body, {abortEarly: false});
      if (error) {
        const mensagens = error.details.map((err) => err.message);
        return res.status(400).json({ error: mensagens });
      }
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(value.senha_user, saltRounds);
      await User.create({
        ...value,
        senha_user: senhaHash
      });
      return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (err) {
      console.error("Erro no registro de usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao cadastrar." });
    }
  }
}

module.exports = new UserController();
