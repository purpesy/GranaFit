var express =  require('express');
var HomeController = require("../controllers/HomeController")
var UserController = require("../controllers/UserController")

var router = express.Router();
router.get("/", HomeController.index);
router.get("/users", UserController.index);
router.get("/users/:id", UserController.findUser);
router.post("/users", UserController.newUser);
router.put("/users/:id", UserController.updateUser);
router.patch("/users/:id", UserController.softDeleteUser);
router.delete("/users/:id", UserController.deleteUser);

module.exports = router;