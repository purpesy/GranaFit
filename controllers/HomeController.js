class HomeController{

    async index(req, res){
        res.send("GranaFit - Sua vida financeira em forma!");
    }

}

module.exports = new HomeController();