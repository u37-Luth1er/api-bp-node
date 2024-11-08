const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
mongoose.connect('mongodb+srv://stream-labs:<password>@busplay.wnws4.mongodb.net/?retryWrites=true&w=majority&appName=busplay');
//mongodb+srv://stream-labs:<db_password>@busplay.wnws4.mongodb.net/?retryWrites=true&w=majority&appName=busplay


const Filme = mongoose.model('filmes', {
    title: String,
    sinopse: String,
    average_rating: String,
    image: String,
    stream_url: String,
    id: Number,
});

//Consultando todos os filmes
app.get("/consultar/todos", async (req, res) => {
    try{
    const todos = await Filme.find();
    res.send(todos)
    }catch(error){
        res.status(500).send("Erro ao consultar filmes!");
    }
})


//listar filmes index of 20 results
app.get("/consultar/filmes", async (req, res) => { // http:localhost:8080/filme?pagina=1&limite=20
    try {
      const pagina = parseInt(req.query.pagina) || 1;  // Padrão para página 1
      const limite = parseInt(req.query.limite) || 20; // Padrão para 20 resultados por página
      const skip = (pagina - 1) * limite; // Calcula quantos documentos pular com base na página atual
  
      const filmes = await Filme.find().skip(skip).limit(limite);
      return res.send(filmes);
    } catch (error) {
      res.status(500).send({ error: "Erro ao consultar filmes" });
    }
  });


//Cadastrar novo filme
app.post("/cadastrar/filme", async (req, res) => {
    const filme_existente = await Filme.findOne({title: req.body.title});
    if(filme_existente){
        // Retorna uma mensagem de erro se o filme já existir
        return res.status(400).send({ error: "Filme já cadastrado" });
    }else{

        try{
            const filme = new Filme({
                title: req.body.title,
                sinopse: req.body.sinopse,
                average_rating: req.body.average_rating,
                image: req.body.image,
                stream_url: req.body.stream_url,
                id: req.body.id,

            });
            filme.save();
            res.send(filme);
        } catch(error) {
            // Tratamento de erros
            res.status(500).send({ error: "Erro ao cadastrar o filme!" });
        }
    }
});


// Deletar Filme by ID
app.delete("/deletar/filme/:id", async (req, res) =>{
    try{
        const deletar_filme = await Filme.findByIdAndDelete(req.params.id);
        if(deletar_filme){
            return res.send({
                "message":"Filme deletado!",
                "detalhes":deletar_filme, 
                "status":"success"
                }
            );
        }else{
            res.status(500).send({error: "Erro ao deletar o filme!"})
        }
    }catch(error){
        res.status(500).send({error: "Erro na Conexão!"})
    }
});


//Atualizar informações de um filme.
app.put("/atualizar/filme/:id", async (req, res) =>{
    try{
        const filme_id = await Filme.findById(req.params.id);
        await Filme.findByIdAndUpdate(req.params.id, 
        {
            title: req.body.title,
            sinopse: req.body.sinopse,
            average_rating: req.body.average_rating,
            image: req.body.image,
            stream_url: req.body.stream_url,
            id: req.body.id,
        });
        const novo_filme = await Filme.findById(req.params.id);
        return res.send({
            "antigo":filme_id,
            "novo":novo_filme    
        });
        
    }catch(error){
        res.status(500).send({error: "Erro ao atualizar o filme!"})
    }
});





app.get("/", (req, res) => {
    res.send("{Connection: Success}");
});
const port = process.env.port || 8080
app.listen(port, () => console.log(`Escutando na porta ${port}`));