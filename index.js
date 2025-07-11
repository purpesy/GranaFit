require("dotenv").config({ quiet: true });
var express = require("express");

const router = require('./routes/routes.js');

var app = express();
app.use(express.json());
app.use("/", router);

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})