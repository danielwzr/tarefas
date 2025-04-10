const express = require("express")
const bp = require("body-parser")
const cors = require("cors")
const app = express()
const sqlite3 = require("sqlite3")
const path = require("path")

app.use(bp.json())
app.use(bp.urlencoded())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

const db = new sqlite3.Database("./db.sqlite")

app.listen(8080, () => {
    console.log("O servidor está aberto na porta 8080")
})

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Tarefas (
	        id INTEGER PRIMARY KEY AUTOINCREMENT, 
	        tarefa VARCHAR(50) NOT NULL,
            categoria VARCHAR(50) 
)`)
})

app.get("/tarefas", (req, res) => {
    db.all(`SELECT * FROM Tarefas`, [], (err, rows) => {
        res.json(rows)
    })
})

app.post("/tarefa", (req, res) => {
    db.run(`INSERT INTO Tarefas (tarefa, categoria) VALUES (?, ?)`, [req.body.tarefa, req.body.categoria])
    res.redirect("/home"); // Redireciona para a página principal após adicionar
})

app.delete("/tarefa/:id", (req, res) => {
    var id = req.params.id
    db.run(`DELETE FROM Tarefas WHERE id == (?)`, [id])
    res.redirect("/home"); // Redireciona para a página principal após adicionar
})

app.get("/home", (req, res) => {
    res.sendFile('index.html', { root: __dirname }) 
    //res -> resposta     sendFile -> enviar arquivo
    //index.html -> é o arquivo
    //root -> identifica para o servidor qual é a pasta raiz
    //dirname -> directory (pasta) atual
})
