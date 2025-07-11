var User = require("../models/User");
const userSchema = require("../validators/userSchema");
const userUpdateSchema = require("../validators/userUpdateSchema");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

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
      const { error, value } = userSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const mensagens = error.details.map((err) => err.message);
        return res.status(400).json({ error: mensagens });
      }
      // verifica email
      const existingUser = await User.findByEmail(value.email_user);
      if (existingUser) {
        return res.status(400).json({ erro: "Email já cadastrado." });
      }
      // hash de senha
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(value.senha_user, saltRounds);
      await User.create({
        ...value,
        senha_user: senhaHash,
      });
      return res
        .status(201)
        .json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (err) {
      console.error("Erro no registro de usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao cadastrar." });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const { error, value } = userUpdateSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const mensagens = error.details.map((e) => e.message);
        return res.status(400).json({ erros: mensagens });
      }
      // hash de senha
      if (value.senha_user) {
        const saltRounds = 10;
        value.senha_user = await bcrypt.hash(value.senha_user, saltRounds);
      }
      // verifica email
      if (value.email_user) {
        const existingUser = await User.findByEmail(value.email_user);
        if (existingUser && existingUser.id_user !== Number(userId)) {
          return res.status(400).json({ erro: "Email já cadastrado." });
        }
      }

      await User.update(userId, value);

      return res
        .status(200)
        .json({ mensagem: "Usuário atualizado com sucesso!" });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao atualizar." });
    }
  }

  async softDeleteUser(req, res) {
    try {
      const userId = req.params.id;

      const updatedCount = await User.softDelete(userId);

      if (updatedCount === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      return res
        .status(200)
        .json({ mensagem: "Usuário suspenso com sucesso!" });
    } catch (err) {
      console.error("Erro ao suspender usuário:", err);
      return res
        .status(500)
        .json({ erro: "Erro interno ao suspender usuário." });
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      const deletedCount = await User.delete(userId);

      if (deletedCount === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      return res
        .status(200)
        .json({ mensagem: "Usuário deletado com sucesso!" });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao deletar usuário." });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      const senhaValida = await bcrypt.compare(password, user.senha_user);
      if (!senhaValida) {
        return res.status(401).json({ erro: "Senha incorreta." });
      }

      const token = jwt.sign(
        {
          id: user.id_user,
          email: user.email_user,
          cargo: user.cargo_user
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      return res.status(200).json({
        mensagem: "Login realizado com sucesso.",
        token,
      });
    } catch (err) {
      console.error("Erro no login:", err);
      return res.status(500).json({ erro: "Erro interno no login." });
    }
  }
}

module.exports = new UserController();
