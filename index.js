const express = require('express')
const app     = express()
const port    = 3000
const mysql   = require('mysql');
const bp = require('body-parser')

app.use(bp.json())

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'clinica'
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
    connection.connect(erro => {
        if (!erro) { console.log('BD conectado!') } 
        else { console.log('Erro na conexão ao BD' + erro.sqlMessage) }
    }) 
  })
app.get('/medicos', (req, res) => {
  connection.query('SELECT * FROM medico', [crm], (err, results) => {
    if (err) {
      console.log('Erro ao consultar os médicos:', err);
      res.status(500).json({ erro: "Erro na consulta de médicos" });
    } else {
      res.json(results); // Retorna os resultados da consulta
    }
  });
});

//Medicos Rota para buscar uma tarefa específica
router.get("/:crm", (req, res) => {
  const crm = req.params.crm;
  executarConsulta('SELECT * FROM medico WHERE crm = ?', [crm], res, "Erro na consulta dos medico");
});

// Rota para criar uma nova tarefa
router.post('/', (req, res) => {
  const {crm, nome, cpf } = req.body;
  executarConsulta('INSERT INTO medico (crm, nome, cpf) VALUES (?, ?, ?)', [crm, nome, cpf], res, "Erro no cadastro do medico!");
});

// Rota para deletar uma tarefa
router.delete("/:crm", (req, res) => {
  const medicoId = req.params.crm;
  executarConsulta('DELETE FROM medico WHERE crm = ?', [medicoId], res, 'Erro ao deletar o medico');
});

// Rota para atualizar uma tarefa
router.put('/', (req, res) => {
  const { crm, nome, cpf} = req.body;
  executarConsulta('UPDATE medico SET nome = ?, cpf =? where crm = ?', [nome, cpf, crm], res, "Erro ao atualizar o medico");
});

module.exports = router;





