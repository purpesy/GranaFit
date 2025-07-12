var db = require("../database/connection.js");
const User = require("./User.js");
const { v4: uuidv4 } = require("uuid");

const userInstance = new User();  

class PasswordToken {
  async create(email) {
    var user = await userInstance.findByEmail(email);
    if (user != undefined) {
      try {
        var token = uuidv4();
        await db
          .insert({
            id_user: user.id_user,
            used: 0,
            token: token,
          })
          .table("tbl_passwordtokens");

        return { status: true, token: token };
      } catch (error) {
        console.log(error);
        return { status: false, error: error };
      }
    } else {
      return { status: false, error: "Usuário não encontrado" };
    }
  }

  async validade(token) {
    try {
      var result = await db
        .select()
        .table("tbl_passwordtokens")
        .where({ token: token });
      if (result.length > 0) {
        var tk = result[0];
        if (tk.used) {
          return { status: false };
        } else {
          return { status: true, token: tk };
        }
      } else {
        return { status: false };
      }
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  }

  async setUsed(token) {
    try {
      await db
        .update({ used: 1 })
        .table("tbl_passwordtokens")
        .where({ token: token });
      return { status: true };
    } catch (error) {
      console.log(error);
      return { status: false, error: error };
    }
  }
}

module.exports = new PasswordToken();
