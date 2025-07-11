var express = require("express");
var app = express();
var port = 8080;

app.get('/', (req, res) => {
    res.send("Hellow World! - Lucas Gabriel");
})

app.listen(port,()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})