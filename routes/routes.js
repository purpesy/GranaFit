var express =  require('express');
var HomeController = require("../controllers/HomeController")

var router = express.Router();
router.get("/", HomeController.index);

module.exports = router;