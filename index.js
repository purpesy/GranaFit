require("dotenv").config({ quiet: true });
var express = require("express");
var cors = require('cors')

const router = require('./routes/routes.js');

var app = express();
app.use(express.json());
app.use(cors());
app.use("/", router);

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})