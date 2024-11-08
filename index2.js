const express = require('express');
const app = express();

app.use(express.json());

const filmes = [
    {id: 1 , name: "Origem", notaIMDB:7, enroll:true},
    {id: 2 , name: "Ilha do medo", notaIMDB:9, enroll:true},
    {id: 3 , name: "lobo de wall street", notaIMDB:8, enroll:true},
    {id: 4 , name: "Jurrasick park", notaIMDB:9, enroll:true},
    {id: 5 , name: "Sheriffer", notaIMDB:"", enroll:true},
]

app.get("/", (req, res) => {
    res.send("NodeJS API Funcionando!");
});


app.get("/api/filmes", (req, res) => {
    res.send(filmes);
});


//consultando todos os filmes a partir de um id
app.get("/api/filmes/:id", (req, res) => {
    const filme = filmes.find((filme_consulta) => filme_consulta.id === parseInt(req.params.id));
    if(!filme) return res.status(404).send("Filme não encontrado!");
    else res.send(filme);
});

//realizando o cadastro de um novo filme
app.post("/api/filmes/:id", (req, res) =>
{

});

//atualizando informações de um filme
app.put("/api/filmes/:id", (req, res) =>{

});


//deletando um filme do banco de dados
app.delete("/api/filmes/:id", (req, res) =>{

});

const port = process.env.port || 8080

app.listen(port, () => console.log(`Escutando na porta ${port}`));