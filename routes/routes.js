var express =  require('express');
var HomeController = require("../controllers/HomeController")
var UserController = require("../controllers/UserController")
var CategoriaController = require("../controllers/CategoriaController")
var adminAuth = require("../middlewares/adminAuth.js")
var auth = require("../middlewares/auth.js")
var router = express.Router();

router.get("/", HomeController.index);
// rotas que precisam de admin
router.get("/users", auth, adminAuth, UserController.index);
router.get("/users/:id", auth, adminAuth, UserController.findUser);
router.patch("/users/:id", auth, adminAuth, UserController.softDeleteUser);
router.delete("/users/:id", auth, adminAuth, UserController.deleteUser);
router.post('/users/:id/send-verification-email', auth, UserController.sendVerificationEmail);

// rotas que precisam de autenticação de usuario
router.put("/users/:id", auth, UserController.updateUser);
router.post('/recover-password', UserController.recoverPassword);
router.post('/change-password', UserController.changePassword);
// rotas públicas
router.post("/cadastro", UserController.newUser);
router.post("/login", UserController.login);
router.get('/verify-email', UserController.verifyEmail);

// rotas de categorias
router.get("/categorias", CategoriaController.index);
router.post("/categorias", CategoriaController.newCategoria);
router.put("/categorias/:id", CategoriaController.updateCategoria);

module.exports = router;