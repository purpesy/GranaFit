const User = require("../models/User");
const userSchema = require("../validators/userSchema");
const userUpdateSchema = require("../validators/userUpdateSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const userInstance = new User();

class UserController {
  // Buscar todos users
  async index(req, res) {
    try {
      const users = await userInstance.findAll();
      if (!users || users.length === 0) {
        return res.status(404).json({ error: "Nenhum usuário encontrado" });
      }
      return res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }
  // buscar user por id
  async findUser(req, res) {
    const { id } = req.params;
    try {
      const user = await userInstance.findById(id);
      if (!user || user.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao procurar usuário" });
    }
  }
  // criar um user
  async newUser(req, res) {
    try {
      const { error, value } = userSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const mensagens = error.details.map((err) => err.message);
        return res.status(400).json({ error: mensagens });
      }

      const existingUser = await userInstance.findByEmail(value.email_user);
      if (existingUser) {
        return res.status(400).json({ erro: "Email já cadastrado." });
      }

      const senhaHash = await bcrypt.hash(value.senha_user, 10);

      await userInstance.create({
        ...value,
        senha_user: senhaHash,
      });

      return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (err) {
      console.error("Erro no registro de usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao cadastrar." });
    }
  }
  // atualizar user
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

      if (value.senha_user) {
        value.senha_user = await bcrypt.hash(value.senha_user, 10);
      }

      if (value.email_user) {
        const existingUser = await userInstance.findByEmail(value.email_user);
        if (existingUser && existingUser.id_user !== Number(userId)) {
          return res.status(400).json({ erro: "Email já cadastrado." });
        }
      }

      await userInstance.update(userId, value);
      return res.status(200).json({ mensagem: "Usuário atualizado com sucesso!" });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao atualizar." });
    }
  }
  // suspender user
  async softDeleteUser(req, res) {
    try {
      const userId = req.params.id;
      const updatedCount = await userInstance.softDelete(userId);

      if (updatedCount === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      return res.status(200).json({ mensagem: "Usuário suspenso com sucesso!" });
    } catch (err) {
      console.error("Erro ao suspender usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao suspender usuário." });
    }
  }
  // deletar user
  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const deletedCount = await userInstance.delete(userId);

      if (deletedCount === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      return res.status(200).json({ mensagem: "Usuário deletado com sucesso!" });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao deletar usuário." });
    }
  }
  // fazer login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
      }

      const user = await userInstance.findByEmail(email);
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
          cargo: user.cargo_user,
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
  // enviar email de verificação
  async sendVerificationEmail(req, res) {
    try {
      const userId = req.params.id;
      const user = await userInstance.findById(userId);

      if (!user || user.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      const token = await User.generateVerificationToken(userId);

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const appUrl = process.env.APP_URL;
      const url = `${appUrl}/verify-email?token=${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email_user,
        subject: "Verifique seu email",
        html: `Clique no link para verificar seu email: <a href="${url}">${url}</a>`,
      });

      return res.status(200).json({ mensagem: "Email de verificação enviado." });
    } catch (err) {
      console.error("Erro ao enviar email de verificação:", err);
      return res.status(500).json({ erro: "Erro ao enviar email de verificação." });
    }
  }
  // verificar email atraves do token
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) return res.status(400).json({ erro: "Token obrigatório." });

      const user = await User.findByVerificationToken(token);
      if (!user) return res.status(400).json({ erro: "Token inválido ou expirado." });

      await User.verifyEmail(user.id_user);

      return res.status(202).json({ mensagem: "Email verificado com sucesso!" });
    } catch (err) {
      console.error("Erro na verificação de email:", err);
      return res.status(500).json({ erro: "Erro interno na verificação de email." });
    }
  }
}

module.exports = new UserController();
