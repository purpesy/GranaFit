require("dotenv").config({ quiet: true });
var express = require("express");
var app = express();

app.get('/', (req, res) => {
    res.send("Inicio de um projeto foda!");
})

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})