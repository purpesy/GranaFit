var express =  require('express');
var HomeController = require("../controllers/HomeController")
var UserController = require("../controllers/UserController")

var router = express.Router();
router.get("/", HomeController.index);
router.get("/users", UserController.index);
router.get("/users/:id", UserController.findUser);

module.exports = router;